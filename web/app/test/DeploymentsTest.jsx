import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';
import sinonStubPromise from 'sinon-stub-promise';
sinonStubPromise(sinon);

import podFixtures from './fixtures/pods.json';
import Deployments from '../js/components/Deployments.jsx';

describe('Deployments', () => {
  let component, resp, fetchStub;

  function withPromise(fn) {
    return component.get(0).serverPromise.then(fn);
  }

  beforeEach(() => {
    fetchStub = sinon.stub(window, 'fetch');
  });

  afterEach(() => {
    window.fetch.restore();
  });

  it('renders the spinner before metrics are loaded', () => {
    fetchStub.returnsPromise().resolves({
      json: () => Promise.resolve({ metrics: [] })
    });
    component = mount(<Deployments />);

    expect(component.find("Deployments")).to.have.length(1);
    expect(component.find("ConduitSpinner")).to.have.length(1);
    expect(component.find("CallToAction")).to.have.length(0);
  });

  it('renders a call to action if no metrics are received', () => {
    fetchStub.returnsPromise().resolves({
      json: () => Promise.resolve({ metrics: [] })
    });
    component = mount(<Deployments />);

    return withPromise(() => {
      expect(component.find("Deployments")).to.have.length(1);
      expect(component.find("ConduitSpinner")).to.have.length(0);
      expect(component.find("CallToAction")).to.have.length(1);
    });
  });

  it('renders the deployments page if metrics are received', () => {
    fetchStub.returnsPromise().resolves({
      json: () => Promise.resolve({ metrics: [], pods: podFixtures.pods })
    });
    component = mount(<Deployments />);

    return withPromise(() => {
      expect(component.find("Deployments")).to.have.length(1);
      expect(component.find("ConduitSpinner")).to.have.length(0);
      expect(component.find("CallToAction")).to.have.length(0);
      expect(component.find("TabbedMetricsTable")).to.have.length(1);
    });
  });
});
