import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import { DragSource, DropTarget } from 'react-dnd'
import Card from './card.js'
import _ from 'lodash';
import { Row, Col ,Icon,Input,Button } from 'antd';

//根据xy值计算所在的格子位置
// const calGridXY(x,y){


// }
const groupItemSource ={
    beginDrag(props, monitor, component) {
        // console.log(props);
        // console.log("asads");
		return {
			id: props.id,
            index: props.index,
            type: props.type
		}
    },
    isDragging(props, monitor){
        // console.log(monitor.getItem())
    }
}

const groupItemTarget ={
    hover(props, monitor, component){
        
        // console.log(props);
        // console.log(121321231313131);
        const dragItem = monitor.getItem();
        // console.log(dragItem);
        // console.log(props);

        if(dragItem.type !== props.type){
            return;
        }
        
        // console.log("hoverGroup");
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        if (dragIndex === hoverIndex){
            return;
        }

        const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()

        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

        const clientOffset = monitor.getClientOffset()

        const hoverClientY = clientOffset.y - hoverBoundingRect.top

        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
			return
        }
        
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
			return
        }
        
        props.moveGroupItem(dragIndex, hoverIndex);

        monitor.getItem().index = hoverIndex;
    },
    drop(props, monitor, component){
        //获取结果来判断是否冒泡,有结果时为冒泡
        if (!_.isNull(monitor.getDropResult())) {
            return;
        }

        const dragItem = monitor.getItem();
        const dropItem = props;
        if (dragItem.type === "group") {
            console.log("group in dropGroup");
            props.onDrop(dragItem , dropItem);
        } else {
            console.log("card in dropGroup");
            const {x,y} = monitor.getClientOffset();
            const groupItemBoundingRect = findDOMNode(component).getBoundingClientRect();
            const groupItemX = groupItemBoundingRect.x;
            const groupItemY = groupItemBoundingRect.y;
            props.dragCardToGroupItem(dragItem,dropItem,x-groupItemX,y-groupItemY);
            // console.log(hoverBoundingRect);
        }
    }
}

function collectSource(connect,monitor){
	return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
	} 
}

function collectTarget(connect, monitor){
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
	}
}

class GroupItem extends Component {
    constructor(props) {
		super(props)
		this.state = {
            forbidDrag: false,
            groupName:""
		}
	}
	createCards(cards){
		let itemDoms = [];
	   _.forEach(cards,(c)=>{
		itemDoms.push(
			<Card drag233={-1} type={c.type}  gridx={c.gridx}  gridy={c.gridy} w={c.width} h={c.height} id={c.pk_appregister} {...this.props.layout} key={c.pk_appregister} deleteCard={this.props.deleteCard} forbidDrag={this.state.forbidDrag}/>
		);
	   });
	   return itemDoms;
	}

    editGroupName = (e) =>{
        let _groupName = e.target.value;
        console.log(_groupName);
        this.state.groupName = _groupName;
    }

    calCarContainerHeight(cards){
        // let resultRow = 0;
        // //行转列，求每列高度和
        // let rowRes = {};
        // _.forEach(cards, (c) => {
        //     if (rowRes[c.gridx]) {
        //         rowRes[c.gridx] += c.height;
        //     } else {
        //         rowRes[c.gridx] = c.height;
        //     }
        // });
        // //求最大高度
        // _.forEach(rowRes, (r) => {
        //     resultRow = resultRow > r ? resultRow : r;
        // })
        const rowRes  = _.chain(cards).sortBy(["gridx","gridy"]).groupBy("gridx").value();
        let endHeight = [];
        _.forEach(rowRes,(r)=>{
            const temp = r[r.length-1];
            endHeight.push(temp.gridy+temp.height);
        });
        const resultRow = _.max(endHeight);
        console.log(resultRow);
        return resultRow*this.props.layout.rowHeight + (resultRow-1)* this.props.layout.margin[1] + 2*this.props.layout.margin[1];
    }
    

    render() {
    const {isDragging,connectDragSource,connectDropTarget, isOver, groupname, id,cards,  currEditID,defaultLayout } = this.props;
    const {changeGroupItemName} = this.props;
    const containerHeight = this.calCarContainerHeight(cards);
    const opacity = isDragging ? 0 : 1;
    let groupItemTitle;
    // console.log(containerHeight);
    if(currEditID === id){
        groupItemTitle = (
            <Row className="group-item-title-container-edit">
                <Col span={4}>
                    <div className="group-item-title-left">
                    <Input  size="small" placeholder="Basic usage" defaultValue = {groupname} onChange={this.editGroupName.bind(this)} />
                    <Icon type="check-square-o" className="group-item-icon" title="占位符" onClick={()=>{this.props.changeGroupName(id,this.state.groupName)}} />
                    <Icon type="close-square-o" className="group-item-icon" title="占位符" onClick={()=>{this.props.cancelGroupName()}}  />
                    </div>
                    
                </Col>
            </Row>
        );
    }else{
        groupItemTitle = (<Row className="group-item-title-container-no-edit">
            <Col span={2} className="group-item-title-left">
            <div><span>{groupname}</span>
            </div>
            </Col>
            <Col span={3} className="group-item-title-right" offset={19}>
            {/* <div style={{ display: 'inline-table' }}><i onClick={()=>{this.changeGroupItemName.bind(this)(id)}} style={{ 'margin-right': 23 ,cursor: 'pointer'}}>Edit</i></div> */}
            <div className="group-item-title-edit" ><Icon type="edit" title="占位符" className="group-item-icon" onClick={()=>{this.props.editGroupItemName(id)}} /></div>
            <div  className="group-item-title-edit"><Icon type="close-square-o"  title="占位符"  className="group-item-icon" onClick={()=>{this.props.deleteGroupItem(id)}} /></div>
            <div className="group-item-title-edit" ><Icon type="plus-square-o"  title="占位符"  className="group-item-icon" onClick={()=>{}}/></div>
            <div  className="group-item-title-edit"><Icon type="ellipsis"  title="占位符"  className="group-item-icon" onClick={()=>{}} /></div>
            </Col>
        </Row>);
    }
    
        return connectDragSource(connectDropTarget(
            <div className="group-item">
                <div className="group-item-container" style={{background: isOver ? 'rgb(172, 175, 175)' : '#ccc' }}>
                    {groupItemTitle}
                    <section id="card-container" style={{ height: containerHeight>defaultLayout.containerHeight?containerHeight:defaultLayout.containerHeight, opacity: opacity }}>
                        {this.createCards(this.props.cards)}
                    </section>
                </div>

                <div>
                    <Button className='group-item-add' onClick={()=>{this.props.addGroupItem(id)}}> + 添加分组</Button>
                </div>
            </div>
            ))
    }
}

export default DropTarget('item',groupItemTarget,collectTarget)(DragSource('item',groupItemSource,collectSource)(GroupItem));