import _ from 'lodash';
import { processRollupMetrics, processTimeseriesMetrics } from '../js/components/util/MetricUtils.js';
import timeseriesFixtures from './fixtures/deployTs.json';
import rollupFixtures from './fixtures/deployRollup.json';
import { expect } from 'chai';


describe('MetricUtils', () => {
  describe('processTsWithLatencyBreakdown', () => {
    it('Converts raw metrics to plottable timeseries data', () => {
      let deployName = 'test/potato3';
      let histograms = ['P50', 'P95', 'P99'];
      let result = processTimeseriesMetrics(timeseriesFixtures.metrics, "targetDeploy")[deployName];

      _.each(histograms, quantile => {
        _.each(result["LATENCY"][quantile], datum => {
          expect(datum.timestamp).not.to.be.empty;
          expect(datum.value).not.to.be.empty;
          expect(datum.label).to.equal(quantile);
        });
      });

      _.each(result["REQUEST_RATE"], datum => {
        expect(datum.timestamp).not.to.be.empty;
        expect(datum.value).to.exist;
      });

      _.each(result["SUCCESS_RATE"], datum => {
        expect(datum.timestamp).not.to.be.empty;
        expect(datum.value).to.exist;
      });
    });
  });

  describe('processMetrics', () => {
    it('Extracts the values from the nested raw rollup response', () => {
      let result = processRollupMetrics(rollupFixtures.metrics, "targetDeploy");
      let expectedResult = [
        {
          name: 'test/potato3',
          requestRate: 6.1,
          successRate: 0.3770491803278688,
          latency: {
            P95: [ { label: 'P95', value: '953' } ],
            P99: [ { label: 'P99', value: '990' } ],
            P50: [ { label: 'P50', value: '537' } ],
          },
          added: true
        }
      ];
      expect(result).to.deep.equal(expectedResult);
    });
  });
});
