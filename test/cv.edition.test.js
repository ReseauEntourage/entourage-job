import React from 'react';
import { expect } from 'chai';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Textarea from '../components/forms/fields/Textarea';
import Input from '../components/forms/fields/Input';

configure({ adapter: new Adapter() });
describe('Form fileds', () => {
  describe('#Textarea', () => {
    it('should update the value', () => {
      let mystory = '';
      const mystoryNew = 'ma nouvelle story blablabla';

      const wrapper = shallow(
        <Textarea
          title="mytitle"
          name="myname"
          onChange={(e) => (mystory = e.target.value)}
        />
      );
      wrapper
        .find('textarea')
        .simulate('change', { target: { value: mystoryNew } });

      expect(mystory).to.equal(mystoryNew);
    });
    it('should take a default value and update', () => {
      let mystory = 'ma story blablabla';
      const mystoryNew = 'ma nouvelle story blablabla';

      const wrapper = shallow(
        <Textarea
          title="mytitle"
          name="myname"
          onChange={(e) => (mystory = e.target.value)}
          value={mystory}
        />
      );
      wrapper
        .find('textarea')
        .simulate('change', { target: { value: mystoryNew } });

      expect(mystory).to.equal(mystoryNew);
    });
  });

  describe('#Input', () => {
    it('should update the value', () => {
      let mystory = '';
      const mystoryNew = 'ma nouvelle story blablabla';

      const wrapper = shallow(
        <Input
          title="mytitle"
          name="myname"
          onChange={(e) => (mystory = e.target.value)}
        />
      );
      wrapper
        .find('input')
        .simulate('change', { target: { value: mystoryNew } });

      expect(mystory).to.equal(mystoryNew);
    });
    it('should take a default value and update', () => {
      let mystory = 'ma story blablabla';
      const mystoryNew = 'ma nouvelle story blablabla';

      const wrapper = shallow(
        <Input
          title="mytitle"
          name="myname"
          onChange={(e) => (mystory = e.target.value)}
          value={mystory}
        />
      );
      wrapper
        .find('input')
        .simulate('change', { target: { value: mystoryNew } });

      expect(mystory).to.equal(mystoryNew);
    });
  });
});
