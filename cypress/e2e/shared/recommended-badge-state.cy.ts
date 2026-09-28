import { BehaviorSubject, defer, finalize, firstValueFrom, of, Subject } from 'rxjs';
import {
  combineRecommendedBadgeState,
  mapUIConfigStatusToRecommended,
  recommendedCollectionFilled,
} from '../../../src/app/shared/helpers/observable-helpers';

describe('Recommendation badge state', () => {
  it('Shares badge subscriptions between navigation and headers and releases them when unused', () => {
    const filled$ = new BehaviorSubject(false);
    let subscriptions = 0;
    let teardowns = 0;
    const badge$ = combineRecommendedBadgeState([{
      recommended$: of(true),
      filled$: defer(() => {
        subscriptions++;
        return filled$.pipe(finalize(() => teardowns++));
      }),
    }]);
    const navigation: unknown[] = [];
    const header: unknown[] = [];
    const first = badge$.subscribe(state => navigation.push(state));
    const second = badge$.subscribe(state => header.push(state));
    expect(subscriptions).to.equal(1);
    filled$.next(true);
    expect(header).to.deep.equal(navigation);
    expect(header[1]).to.deep.equal({ visible: true, filled: true });
    first.unsubscribe();
    expect(teardowns).to.equal(0);
    second.unsubscribe();
    expect(teardowns).to.equal(1);
    const next = badge$.subscribe();
    expect(subscriptions).to.equal(2);
    next.unsubscribe();
  });

  const field = (recommended: boolean, filled: boolean) => ({ recommended$: of(recommended), filled$: of(filled) });

  it('Ignores empty children which are not recommended', async () => {
    const state = await firstValueFrom(combineRecommendedBadgeState([field(true, true), field(false, false)]));
    expect(state).to.deep.equal({ visible: true, filled: true });
  });

  it('Ignores disabled recommendations', async () => {
    const recommended = await firstValueFrom(of({ enabled: false, recommended: true }).pipe(mapUIConfigStatusToRecommended()));
    expect(recommended).to.equal(false);
  });

  it('Loads only recommended collections and discards results for the previous record', () => {
    const record$ = new BehaviorSubject('first');
    const recommended$ = new BehaviorSubject(false);
    const first$ = new Subject<unknown[]>();
    const second$ = new Subject<unknown[]>();
    let requests = 0;
    let filled = false;
    const subscription = recommendedCollectionFilled(record$, recommended$, (record) => {
      requests++;
      return record === 'first' ? first$ : second$;
    }).subscribe((value) => filled = value);
    expect(requests).to.equal(0);
    recommended$.next(true);
    first$.next([{}]);
    expect(filled).to.equal(true);
    record$.next('second');
    expect(filled).to.equal(false);
    first$.next([{}]);
    expect(filled).to.equal(false);
    second$.next([{}]);
    expect(filled).to.equal(true);
    recommended$.next(false);
    expect(filled).to.equal(false);
    expect(requests).to.equal(2);
    subscription.unsubscribe();
  });
});
