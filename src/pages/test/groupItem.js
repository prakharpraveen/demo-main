import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import { DragSource, DropTarget } from 'react-dnd'
import Card from './card.js'
import _ from 'lodash';
import {Icon,Input,Button } from 'antd';

const groupItemSource ={
    beginDrag(props, monitor, component) {
        console.log(props);
		return {
			id: props.id,
            index: props.index,
            type: props.type
		}
    },
	canDrag(props, monitor){
		return props.currEditID === ""?true: false;
	}
}

const groupItemTarget ={
    hover(props, monitor, component) {
        const dragItem = monitor.getItem();
        // console.log(dragItem.type, props.type);
        if (dragItem.type === "group") {//组hover到组
            const dragIndex = monitor.getItem().index;
            const hoverIndex = props.index;

            if (dragIndex === hoverIndex) {
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
        } else {//卡片到组
            const hoverItem = props;
            const {x,y} = monitor.getClientOffset();
            const groupItemBoundingRect = findDOMNode(component).getBoundingClientRect();
            const groupItemX = groupItemBoundingRect.x;
            const groupItemY = groupItemBoundingRect.y;
            props.moveCardInGroupItem(dragItem, hoverItem, x-groupItemX,y-groupItemY);
        }
    },
    drop(props, monitor, component){
        //获取结果来判断是否冒泡,有结果时为冒泡
        if (!_.isNull(monitor.getDropResult())) {
            return;
        }

        const dragItem = monitor.getItem();
        const dropItem = props;
        if (dragItem.type === "group") {
            // console.log("group in dropGroup");
            props.onDrop(dragItem , dropItem);
        } else {
            console.log("card in dropGroup");
            // const {x,y} = monitor.getClientOffset();
            // const groupItemBoundingRect = findDOMNode(component).getBoundingClientRect();
            // const groupItemX = groupItemBoundingRect.x;
            // const groupItemY = groupItemBoundingRect.y;
            // props.dropCardToGroupItem(dragItem,dropItem,x-groupItemX,y-groupItemY);
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
    
    componentWillReceiveProps(nextProps) {
		if (!this.props.isOver && nextProps.isOver) {
			// You can use this as enter handler
			// console.log("groupItem enter");
		}

		if (this.props.isOver && !nextProps.isOver) {
			// You can use this as leave handler
			// console.log("groupItem leave");
		}
    }
    //创建卡片
    createCards(cards) {
        let itemDoms = [];
        _.forEach(cards, (c) => {
            itemDoms.push(
                <Card dragCardID={-1} 
                type={c.apptype}
                {...c} 
                id={c.pk_appregister}
                {...this.props.layout}
                key={c.pk_appregister} 
                deleteCard={this.props.deleteCard} 
                forbidDrag={this.state.forbidDrag} 
                onCheckboxChange={this.props.onCheckboxChange}
                selectCardIDList = {this.props.selectCardIDList}
                />
            );
        });
        return itemDoms;
    }
    //获得组名
    getGroupName = (e) =>{
        let _groupName = e.target.value;
        // console.log(_groupName);
        this.state.groupName = _groupName;
    }
    //计算卡片容器的最大高度
    getContainerMaxHeight(cards) {
        //行转列并且分组
        const rowRes = _.chain(cards).sortBy(["gridx", "gridy"]).groupBy("gridx").value();
        //寻找每列最后item的GridY和height的和
        let endHeight = [];
        _.forEach(rowRes, (r) => {
            const temp = r[r.length - 1];
            endHeight.push(temp.gridy + temp.height);
        });
        //获得最大的值
        const resultRow = _.max(endHeight);
        return resultRow * this.props.layout.rowHeight + (resultRow - 1) * this.props.layout.margin[1] + 2 * this.props.layout.margin[1];
    }
    
    //计算容器的每一个格子多大
    calColWidth() {
        const { containerWidth, col, containerPadding, margin } = this.props.layout;

        if (margin) {
            return (containerWidth - containerPadding[0] * 2 -  margin[0] * (col + 1)) / col
        }
        return (containerWidth - containerPadding[0] * 2 - 0 * (col + 1)) / col
    }

	componentDidMount() {
		let { layout } = this.props;
		const containerDom = document.querySelector("#card-container");
		const clientWidth = containerDom.clientWidth;
		this.props.layout.containerWidth = clientWidth;

		const calWidth = this.calColWidth();

		layout.calWidth = layout.rowHeight = calWidth;
		layout.containerWidth = clientWidth;
        this.props.resetContainer(layout);
    }
    
    render() {
    const {isDragging,connectDragSource,connectDropTarget, isOver, groupname, id,index,length,cards,  currEditID,defaultLayout } = this.props;
    const containerHeight = this.getContainerMaxHeight(cards);
    const opacity = isDragging ? 0 : 1;
    let groupItemTitle;
    if(currEditID === id){
        groupItemTitle = (
            <div className="group-item-title-container-no-edit">
                <div class="title-left">
                    <Input size="small" placeholder="占位符" defaultValue={groupname} onChange={this.getGroupName.bind(this)} />
                    <Icon type="check-square-o" className="group-item-icon" title="占位符" onClick={() => { this.props.changeGroupName(id, this.state.groupName) }} />
                    <Icon type="close-square-o" className="group-item-icon" title="占位符" onClick={() => { this.props.cancelGroupName() }} />
                </div>
            </div>
        );
    }else{
        groupItemTitle = (
            <div className="group-item-title-container-no-edit" >
                <div class="title-left">
                    <span>{groupname}</span>
                </div>
                <div class="title-right">
                    <div className="group-item-title-edit" ><Icon type="edit" title="占位符" className="group-item-icon" onClick={() => { this.props.editGroupItemName(id) }} /></div>
                    <div className={index === 0 ? "group-item-title-not-edit" : "group-item-title-edit"}><Icon type="up-square-o" title="占位符" className="group-item-icon" onClick={() => { this.props.upGroupItem(id) }} /></div>
                    <div className={index === length - 1 ? "group-item-title-not-edit" : "group-item-title-edit"}><Icon type="down-square-o" title="占位符" className="group-item-icon" onClick={() => { this.props.downGroupItem(id) }} /></div>
                    <div className="group-item-title-edit"><Icon type="close-square-o" title="占位符" className="group-item-icon" onClick={() => { this.props.deleteGroupItem(id) }} /></div>
                </div>
            </div>
        );
    }
    
    return connectDragSource(connectDropTarget(
        <div className="group-item" style={{ opacity: opacity}}>
            <div className="group-item-container" style={{background: isOver ? 'rgb(172, 175, 175)' : '#ccc' }}>
                {groupItemTitle}
                <section id="card-container" style={{ height: containerHeight>defaultLayout.containerHeight?containerHeight:defaultLayout.containerHeight}}>
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