// @flow

import React from "react";
import {shallow} from "enzyme";
import {TableRow} from "./TableRow";

import {COLUMNS} from "./sharedTestUtils";
require("../../testUtil").configureEnzyme();

describe("app/credExplorer/pagerankTable/TableRow", () => {
  function example(depth: number = 3) {
    return shallow(
      <TableRow
        depth={depth}
        description={<span data-test-description={true} />}
        connectionProportion={0.5}
        score={133.7}
        children={<div data-test-children={true} />}
      />
    );
  }
  it("has depth-based color", () => {
    for (const depth of [0, 1, 2]) {
      const el = example(depth);
      const style = el.find("tr").props().style;
      expect({depth, style}).toMatchSnapshot();
    }
  });
  it("has depth-based indentation", () => {
    for (const depth of [0, 1, 2]) {
      const el = example(depth);
      const style = el
        .find("td")
        .at(0)
        .find("button")
        .props().style;
      expect({depth, style}).toMatchSnapshot();
    }
  });
  it("expand button toggles symbol based on expansion state", () => {
    const el = example();
    el.setState({expanded: false});
    expect(el.find("button").text()).toEqual("+");
    el.setState({expanded: true});
    expect(el.find("button").text()).toEqual("\u2212");
  });
  it("clicking the expand button toggles expansion state", () => {
    const el = example();
    el.setState({expanded: false});
    el.find("button").simulate("click");
    expect(el.state().expanded).toBe(true);
    el.find("button").simulate("click");
    expect(el.state().expanded).toBe(false);
  });
  it("defaults to not expanded", () => {
    const el = example();
    expect(el.state().expanded).toBe(false);
  });
  it("displays children only when expanded", () => {
    const el = example();
    el.setState({expanded: false});
    expect(el.find({"data-test-children": true})).toHaveLength(0);
    el.setState({expanded: true});
    expect(el.find({"data-test-children": true})).toHaveLength(1);
  });
  it("has the correct number of columns", () => {
    const el = example();
    expect(el.find("td")).toHaveLength(COLUMNS().length);
  });
  it("displays formatted connectionPercentage in the correct column", () => {
    const index = COLUMNS().indexOf("Connection");
    expect(index).not.toEqual(-1);
    const td = example()
      .find("td")
      .at(index);
    expect(td.text()).toEqual("50.00%");
  });
  it("displays empty column when connectionProportion not set", () => {
    const index = COLUMNS().indexOf("Connection");
    expect(index).not.toEqual(-1);
    const el = example();
    el.setProps({connectionProportion: null});
    const td = el.find("td").at(index);
    expect(td.text()).toEqual("");
  });
  it("displays formatted score in the correct column", () => {
    const index = COLUMNS().indexOf("Score");
    expect(index).not.toEqual(-1);
    const td = example()
      .find("td")
      .at(index);
    expect(td.text()).toEqual("133.70");
  });
  it("displays the description in the correct column", () => {
    const index = COLUMNS().indexOf("Description");
    expect(index).not.toEqual(-1);
    const td = example()
      .find("td")
      .at(index);
    expect(td.find({"data-test-description": true})).toHaveLength(1);
  });
});