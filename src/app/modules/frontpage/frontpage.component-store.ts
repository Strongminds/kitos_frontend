import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, delay, of, switchMap, tap } from 'rxjs';

interface FrontpageText {
  id: number;
  value: string;
}

interface FrontpageComponentStoreState {
  loading: boolean;
  text: FrontpageText[];
}

@Injectable()
export class FrontpageComponentStore extends ComponentStore<FrontpageComponentStoreState> {
  constructor() {
    super({
      loading: false,
      text: [],
    });
  }

  readonly loading$: Observable<boolean> = this.select((state) => state.loading);
  readonly text$: Observable<FrontpageText[]> = this.select((state) => state.text);

  readonly updateLoading = this.updater(
    (state, loading: boolean): FrontpageComponentStoreState => ({
      ...state,
      loading,
    })
  );

  readonly updateText = this.updater(
    (state, text: FrontpageText[]): FrontpageComponentStoreState => ({
      ...state,
      loading: false,
      text,
    })
  );

  readonly getText = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => this.updateLoading(true)),
      switchMap(() =>
        of(this.mockTextResponse).pipe(
          delay(1000),
          tapResponse(
            (response) => this.updateText(response.response),
            (e) => {
              console.error(e);
              this.updateLoading(false);
            }
          )
        )
      )
    )
  );

  private mockTextResponse = {
    msg: '',
    response: [
      {
        id: 1,
        value:
          '<h3><strong>Kitos - Kommunernes IT OverbliksSystem</strong></h3>\n<div>Kitos er en web-baseret l&oslash;sning, der&nbsp;anvendes af 77 kommuner.</div>\n<div>Kitos skaber overblik over den samlede kommunale IT-portef&oslash;lje.</div>\n<div>&nbsp;</div>\n<div>Det digitale f&aelig;llesskab OS2 s&oslash;rger for forvaltning af Kitos. P&aring; <a title="Om KITOS " href="https://os2.eu/produkt/os2kitos" target="_blank">os2.eu</a> kan I l&aelig;se mere om Kitos baggrund og form&aring;l.&nbsp;</div>\n<div>\n<h3><strong>OS2kitos styregruppen</strong></h3>\n<div>Se hvem der sidder i OS2kitos <a href="https://os2.eu/wiki/styregruppe-os2kitos" target="_blank">styregruppe</a></div>\n<div>\n<h3><strong>Tilslut&nbsp;din kommune til&nbsp;Kitos</strong></h3>\n<div>L&aelig;s om hvordan jeres kommuner kan komme p&aring; l&oslash;sningen og en beskrivelse af governance-modellen for OS2kitos&nbsp;<a href="https://os2.eu/dokument/ny-tilslutnings-og-samarbejdsaftale-os2kitos" target="_blank">her.</a></div>\n<div>&nbsp;</div>\n</div>\n</div>',
      },
      {
        id: 2,
        value:
          '<h3><strong>Blogindl&aelig;g&nbsp;om Kitos p&aring; os2.eu</strong></h3>\n<div>Du kan l&aelig;se&nbsp;nyheder om OS2kitos p&aring;&nbsp;<a title="OS2kitos nyheder" href="https://os2.eu/node/236/blog" target="_blank">os2.eu</a>.</div>\n<div>&nbsp;</div>\n<h3><strong>Nyhedsbrev om Kitos</strong></h3>\n<div>Tilmeld dig <a href="https://os2.eu/produkt/os2kitos" target="_blank">nyhedsbrev</a>.</div>\n<div>&nbsp;</div>\n<div>\n<h3><strong>Link til Kitos\'s Loop</strong></h3>\n<p>Vi skifter kommunikations- og vidensdelingsplatform fra Yammer til Loop i l&oslash;bet af efter&aring;ret 2020.</p>\n<p>Er du ikke allerede oprettet i Loop, vil vi opfordre dig til at blive det, s&aring; du ikke g&aring;r glip af vigtig information vedr. Kitos.</p>\n<p>Via linket herunder kan du anmode om en konto, hvorefter Sekretariatet vil godkende din anmodning. Eller, hvis du allerede har en konto, kan du logge p&aring; Loop.</p>\n<p><strong>Link til Kitos Loop</strong> (bliver aktivt, n&aring;r vi er klar med Loop).</p>\n<p>&nbsp;</p>\n</div>',
      },
      {
        id: 3,
        value:
          '<h3><strong>Hj&aelig;lp og vejledning til Kitos</strong></h3>\n<p>Kitos best&aring;r af 5 moduler:&nbsp;IT underst&oslash;ttelse af organisation, IT Projekter, IT Systemer, IT Kontrakter og IT Rapporter.</p>\n<p>Der er vejledninger&nbsp;til de centrale funktioner i Kitos.</p>\n<p>Sekretariatet har udarbejdet en <strong><a title="anbefalet implementeringsplan" href="https://os2.eu/sites/default/files/documents/anbefalet_implementeringsplan.pdf" target="_blank">anbefalet implementeringsplan</a></strong> til nye kommuner.</p>\n<p>De enkelte sider i Kitos har ogs&aring; hj&aelig;lpetekster vist under ?.<br /><br /><strong>Skabeloner til brug ved oprettelse af IT-Systemer og snitflader</strong></p>\n<ul>\n<li><a href="https://os2.eu/dokument/indberetning-af-nye-it-systemer" target="_blank">Indberetning af nye IT-Systemer</a></li>\n<li><a href="https://os2.eu/dokument/indberetning-af-nye-snitflader" target="_blank">Indberetning af nye snitflader</a></li>\n</ul>\n<p><strong>SSO login med STS Adgangsstyring</strong></p>\n<ul>\n<li><a href="https://os2.eu/dokument/kitos-vejledning-sso-med-sts-adgangsstyring" target="_blank">Vejledning i brug af SSO</a></li>\n</ul>\n<p><strong>Generelt<br /></strong></p>\n<ul>\n<li><a title="Administrer moduler" href="https://os2.eu/sites/default/files/documents/generelt_-_administrer_moduler.pdf" target="_blank">Administrer moduler</a></li>\n<li><a title="Vejledning om udfaldsrum og lokale beskrivelser" href="https://os2.eu/sites/default/files/documents/udfaldsrum_og_lokale_beskrivelser.pdf" target="_blank">Udfaldsrum og lokale beskrivelser</a></li>\n<li><a title="Advis" href="https://os2.eu/sites/default/files/documents/generelt_-_advis_0.pdf" target="_blank">Advis</a></li>\n<li><a title="KLE-opm&aelig;rkning" href="https://os2.eu/sites/default/files/documents/generelt_-_kle_0.pdf" target="_blank">KLE-opm&aelig;rkning</a></li>\n<li><a title="Log ind som ny bruger" href="https://os2.eu/dokument/kitos-vejledning-generelt-login-som-ny-bruger" target="_blank">Log ind som ny bruger</a></li>\n<li><a title="Rediger din egen brugerprofil" href="https://os2.eu/sites/default/files/documents/rediger_din_egen_brugerprofil.pdf" target="_blank">Rediger din egen brugerprofil</a></li>\n<li><a title="Referencer" href="https://os2.eu/sites/default/files/documents/generelt_-_referencer.pdf" target="_blank">Referencer</a></li>\n</ul>\n<p><strong>Organisation</strong></p>\n<ul>\n<li><a title="Opret bruger" href="https://os2.eu/dokument/kitos-vejledning-organisation-opret-rediger-og-slet-en-brugerprofil" target="_blank">Opret, rediger og slet en brugerprofil</a></li>\n<li><a title="Administrer brugerroller" href="https://os2.eu/sites/default/files/documents/masseadministration_af_en_brugers_roller.pdf" target="_blank">Masseadministration af en brugers roller</a></li>\n<li><a title="Opret og administrer underenheder" href="https://os2.eu/dokument/kitos-vejledning-organisation-underenheder" target="_blank">Underenheder</a></li>\n</ul>\n<p><strong>IT-Systemer</strong></p>\n<ul>\n<li><a title="Intro til modulet IT-Systemer" href="https://os2.eu/sites/default/files/documents/systemer_-_generelt_0.pdf" target="_blank">Intro til modulet IT-systemer</a></li>\n<li><a title="Anvendelse af IT-Systemer" href="https://os2.eu/dokument/kitos-vejledning-it-systemer-anvendelse" target="_blank">Anvendelse af IT-systemer</a></li>\n<li><a href="https://os2.eu/dokument/kitos-vejledning-it-systemer-relation-og-snitflader-mellem-it-systemer">Relationer og snitflader mellem IT-systemer</a></li>\n</ul>\n<p><strong>IT-Kontrakter</strong></p>\n<ul>\n<li><strong><a title="Intro til modulet IT-Kontrakter" href="https://os2.eu/sites/default/files/documents/kontrakter_-_generelt.pdf" target="_blank">Intro til modulet IT-Kontrakter</a></strong></li>\n<li><a href="https://os2.eu/dokument/kitos-vejledning-it-systemer-guide-til-finde-snitflader">Masseoprettelse af IT-Kontrakter</a></li>\n</ul>\n<p><br /><strong>IT-Projekter</strong></p>\n<p><a title="Klik her for at downloade vejledningen om projekter" href="https://os2.eu/sites/default/files/documents/projekter_-_generelt_0.pdf" target="_blank">Intro til Projektmodulet</a><br /><br /><strong>Rapporter</strong></p>\n<p><a title="Intro til modulet IT-Rapporter" href="https://os2.eu/sites/default/files/documents/rapporter_-_brugervejledning_0.pdf" target="_blank">Intro til Rapportmodulet</a></p>',
      },
      { id: 4, value: '<h2>OBS: Dette er et testmilj&oslash; for os2kitos</h2>' },
      {
        id: 5,
        value:
          '<h3><strong>Kontakt sekretariatet</strong></h3>\n<p>Skriv til sekretariatet ved sp&oslash;rgsm&aring;l: info@kitos.dk</p>\n<p>&nbsp;</p>',
      },
    ],
  };
}
