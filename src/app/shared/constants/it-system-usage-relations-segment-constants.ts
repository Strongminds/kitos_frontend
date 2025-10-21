import { SegmentButtonOption } from '../components/segment/segment.component';

export enum ItSystemUsageRelationSegmentOption {
  Outgoing = 'outgoing',
  Incoming = 'incoming',
}

export const itSystemUsageRelationSegmentOptions: SegmentButtonOption<ItSystemUsageRelationSegmentOption>[] = [
  { text: $localize`Outgoing relations`, value: ItSystemUsageRelationSegmentOption.Outgoing },
  {
    text: $localize`Incoming relations`,
    value: ItSystemUsageRelationSegmentOption.Incoming,
  },
];
