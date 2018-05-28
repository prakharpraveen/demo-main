import React,{ Component } from 'react';
import { Button, Table, Popconfirm } from 'antd';

class EditableTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [{
                key: '0',
                name: 'Edward King 0',
                age: '32',
                address: 'London, Park Lane no. 0',
            }, {
                key: '1',
                name: 'Edward King 1',
                age: '32',
                address: 'London, Park Lane no. 1',
            }],
            count: 2,
        };
    }
    
    onDelete = (key) => {
        const dataSource = [...this.state.dataSource];
        this.setState({
            dataSource: dataSource.filter(item => item.key !== key)
        });
    }
    handleAdd = () => {
        const {
            count,
            dataSource
        } = this.state;
        const newData = {
            key: count,
            name: `Edward King ${count}`,
            age: 32,
            address: `London, Park Lane no. ${count}`,
        };
        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1,
        });
    }
    render() {
        const {
            dataSource
        } = this.state;
        const columns = this.columns;
        return ( 
            <div>
                <Button 
                    onClick = {this.handleAdd}
                    type = "primary"
                    style = {{marginBottom: 16}}>
                    Add a row 
                </Button> 
                <Table  
                    bordered
                    pagination={false} 
                    rowKey={this.props.rowKey} 
                    size="middle"  
                    dataSource={this.props.dataSource} 
                    columns = {this.props.columns}
                /> 
            </div>
        );
    }
};
export default EditableTable;