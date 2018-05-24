import React,{Component} from 'react';
import { Form, Row, Col, Input, Button, Icon } from 'antd';
import ComLayout from './ComLayout';
const FormItem = Form.Item;
class DefaultSetting extends Component{
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <ComLayout className='defaultSetting' title={this.props.title}>
                <div className='default-title'>默认设置</div>
                <div className='dafault-form'>
                    <Form
                        className="ant-advanced-search-form"
                        onSubmit={this.handleSearch}
                    >
                        <Row gutter={24}>{this.getFields()}</Row>
                        <Row>
                        <Col span={24} style={{ textAlign: 'right' }}>
                            <Button type="primary" htmlType="submit">Search</Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                            Clear
                            </Button>
                            <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
                            Collapse <Icon type={this.state.expand ? 'up' : 'down'} />
                            </a>
                        </Col>
                        </Row>
                    </Form>
                </div>
                <div className='default-title'>默认语言格式</div>
                <div className='dafault-form'>
                    22222
                </div>
            </ComLayout>
        )
    }
}
export default DefaultSetting;