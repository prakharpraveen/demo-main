import React, { Component } from 'react';
import _ from 'lodash';
import { Layout, Cascader,Input, Button  } from 'antd';
const { Sider } = Layout;
const Search = Input.Search;
import Ajax from 'Pub/js/ajax';

const options = [{
	value: 'lingyu1',
	label: '领域1',
	children: [{
	  value: 'mokuai1',
	  label: '模块1'
	},
	{
		value: 'mokuai2',
		label: '模块2'
	  }],
  }, {
	value: 'lingyu2',
	label: '领域2',
	children: [{
	  value: 'mokuai2',
	  label: '模块2'
	}]
  }];

  function onChange(value) {
	console.log(value);
  }

class MySider extends Component {
	constructor(props) {
		super(props);
		this.state = {};
    }
    getNode(){
        return (
            <Button onClick={this.cancleSave.bind(this)}>取消</Button>
        )
    }
    cancleSave(){
        alert(123)
    }
	render() {
        const contentHeight = this.props.contentHeight;
		return (
			<Sider
				className='nc-workbench-home-sider'
				breakpoint='lg'
				collapsedWidth='200'
				width='300'
				style={{ height: contentHeight }}
			>
            <Search
      placeholder="请输入应用名称"
      onSearch={value => console.log(value)}
      style={{ width: 200 }}
    />
				<div>
					<Cascader style={{ width: 200 }}  options={options} onChange={onChange} placeholder='领域-模块' />
				</div>
			</Sider>
		);
	}
}

export default MySider;
