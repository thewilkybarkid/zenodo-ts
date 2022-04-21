import { Doi, isDoi } from 'doi-ts'
import * as fc from 'fast-check'
import { isNonEmpty } from 'fp-ts/Array'
import merge from 'ts-deepmerge'
import * as _ from '../src'

export * from 'fast-check'

export const doi = (): fc.Arbitrary<Doi> =>
  fc
    .tuple(
      fc.stringOf(fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9'), { minLength: 4 }),
      fc.unicodeString({ minLength: 1 }),
    )
    .map(([prefix, suffix]) => `10.${prefix}/${suffix}` as Doi)
    .filter(isDoi)

export const zenodoRecord = (): fc.Arbitrary<_.Record> =>
  fc
    .tuple(
      fc.record({
        id: fc.integer(),
        metadata: fc.record({
          creators: fc
            .array(
              fc.record({
                name: fc.string(),
              }),
              { minLength: 1 },
            )
            .filter(isNonEmpty),
          description: fc.string(),
          doi: doi(),
          title: fc.string(),
        }),
      }),
      fc.record({
        metadata: fc.record({
          resource_type: fc.oneof(
            fc.record({
              type: fc.constantFrom(
                'dataset' as const,
                'figure' as const,
                'lesson' as const,
                'other' as const,
                'physicalobject' as const,
                'poster' as const,
                'presentation' as const,
                'software' as const,
                'video' as const,
              ),
            }),
            fc.record({
              type: fc.constant('image' as const),
              subtype: fc.constantFrom(
                'diagram' as const,
                'drawing' as const,
                'figure' as const,
                'other' as const,
                'photo' as const,
                'plot' as const,
              ),
            }),
            fc.record({
              type: fc.constant('publication' as const),
              subtype: fc.constantFrom(
                'annotationcollection' as const,
                'article' as const,
                'book' as const,
                'conferencepaper' as const,
                'datamanagementplan' as const,
                'deliverable' as const,
                'milestone' as const,
                'other' as const,
                'patent' as const,
                'preprint' as const,
                'proposal' as const,
                'report' as const,
                'section' as const,
                'softwaredocumentation' as const,
                'taxonomictreatment' as const,
                'technicalnote' as const,
                'thesis' as const,
                'workingpaper' as const,
              ),
            }),
          ),
        }),
      }),
    )
    .map(records => merge.withOptions({ mergeArrays: false }, ...records))
