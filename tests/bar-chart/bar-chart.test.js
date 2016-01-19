/* eslint-env node, mocha */
import chai, {should as chaiShould, expect} from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react/lib/ReactTestUtils';
import {BarChart} from 'react-easy-chart';
import spies from 'chai-spies';

const should = chaiShould();
chai.use(spies);

const testData = [
  {key: 'A', value: 0.5},
  {key: 'B', value: 0.2},
  {key: 'C', value: 0.1}];

describe('BarChart component', () => {
  it('should be defined', () => {
    should.exist(BarChart);
    BarChart.should.be.a('function');
  });

  it('should render without problems', () => {
    const chart = TestUtils.renderIntoDocument(<BarChart data={testData}/>);
    should.exist(chart);
  });

  it('should have default values for optional properties', () => {
    const chart = TestUtils.renderIntoDocument(
      <BarChart data={testData}
        axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
        margin={{top: 0, right: 0, bottom: 0, left: 0}}
      />
    );
    chart.should.have.property('props');
    chart.props.data.should.have.length(3);

    // margin test
    expect(chart.props).to.have.deep.property('margin.top', 0);

    // width and height
    expect(chart.props).to.have.property('width', 400);
    expect(chart.props).to.have.property('height', 200);

    // axes test
    expect(chart.props).to.have.property('axes', false);

    // axes labels
    expect(chart.props).to.have.deep.property('axisLabels.x', 'My x Axis');
  });

  it('should render an svg and 3 bars', () => {
    const shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<BarChart data={testData}/>);
    const vdom = shallowRenderer.getRenderOutput();
    expect(vdom.type).to.equal('div');
    const svg = vdom.props.children[1];
    expect(svg.type).to.equal('svg');
    const g = svg.props.children[0];
    expect(g.props.transform).to.equal('translate(0,0)');
    expect(g.props.children[0].type).to.equal('rect');
    expect(g.props.children[1].type).to.equal('rect');
    expect(g.props.children[2].type).to.equal('rect');
  });

  it('should support clickHandler on bar', () => {
    const spy = chai.spy(() => {});
    const chart = TestUtils.renderIntoDocument(<BarChart data={testData} clickHandler={spy}/>);
    const domRoot = ReactDOM.findDOMNode(chart);
    const svgNode = domRoot.childNodes[1];
    const barNode = svgNode.childNodes[0].childNodes[1];
    TestUtils.Simulate.click(barNode);
    expect(spy).to.have.been.called();
  });

  it('should support mouseOver, mouseOut and mousemove', () => {
    const mouseOverSpy = chai.spy(() => {});
    const mouseOutSpy = chai.spy(() => {});
    const mouseMoveSpy = chai.spy(() => {});
    const chart = TestUtils.renderIntoDocument(
      <BarChart data={testData}
        mouseOverHandler={mouseOverSpy}
        mouseOutHandler={mouseOutSpy}
        mouseMoveHandler={mouseMoveSpy}
      />);
    const domRoot = ReactDOM.findDOMNode(chart);
    const svgNode = domRoot.childNodes[1];
    const barNode = svgNode.childNodes[0].childNodes[1];

    TestUtils.SimulateNative.mouseOver(barNode);
    expect(mouseOverSpy).to.have.been.called();

    TestUtils.SimulateNative.mouseOut(barNode);
    expect(mouseOutSpy).to.have.been.called();

    TestUtils.SimulateNative.mouseMove(barNode);
    expect(mouseMoveSpy).to.have.been.called();
  });
});