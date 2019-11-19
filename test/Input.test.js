import React from 'react';
import { expect } from 'chai';
import { render, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { spy } from 'sinon';

import Input from '../components/forms/fields/Input';

configure({ adapter: new Adapter() });

describe('Composant Input', () => {
  const id = 'myId';
  const name = 'myName';
  const type = 'myType';
  const placeholder = 'myPlaceholder';
  const onChange = console.log;
  const title = 'myTitle';

  it('doit contenir un input', () => {
    const wrapper = render(
      <Input
        id={id}
        name={name}
        type={type}
        title={title}
        placeholder={placeholder}
        onChange={onChange}
      />
    );

    // const inputJSX = (
    //   <input
    //     id={id}
    //     name={name}
    //     type={type}
    //     onChange={onChange}
    //     placeholder={placeholder}
    //     className="uk-input uk-form-large"
    //   />
    // );
    expect(wrapper.has('input').length).gt(0);
  });
});
