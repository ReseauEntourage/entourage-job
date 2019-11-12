import React from 'react';
import { expect } from 'chai';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Input from '../components/forms/fields/Input';

configure({ adapter: new Adapter() });

describe('Input component testing', function() {
  const id = 'myId';
  const name = 'myName';
  const type = 'myType';
  const placeholder = 'myPlaceholder';
  const onChange = console.log;
  const title = 'myTitle';

  it('renders welcome message', function() {
    const v = (
      <Input
        id={id}
        name={name}
        type={type}
        title={title}
        placeholder={placeholder}
        onChange={onChange}
      />
    );

    const wrapper = shallow(v);
    const inputJSX = (
      <input
        id={id}
        name={name}
        type={type}
        onChange={onChange}
        placeholder={placeholder}
        className="uk-input uk-form-large"
      />
    );
    expect(wrapper.contains(inputJSX)).to.equal(true);
  });
});
