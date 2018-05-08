import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import { connect } from 'react-redux'
import { DragSource, DropTarget } from 'react-dnd'
import Card from './card.js'
import _ from 'lodash';
import {Icon,Input,Button,Checkbox } from 'antd';
import {collision,layoutCheck} from './collision';
import {compactLayout} from './compact.js';
import * as utilService from './utilService';
import { updateGroupList,updateCurrEditID, updateLayout } from 'Store/test/action';

const groupItemSource ={
    beginDrag(props, monitor, component) {
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

        console.log(props);
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
        
        console.log(props);
        //获取结果来判断是否冒泡,有结果时为冒泡
        // if (!_.isNull(monitor.getDropResult())) {
        //     return;
        // }
        const dragItem = monitor.getItem();
        const dropItem = props;
        if (dragItem.type === "group") {
            console.log("group in dropGroup");
            props.onDrop(dragItem , dropItem);
        } else {
            console.log(dragItem);
            console.log("card in dropGroup");
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
            groupName:props.groupname
		}
    }
    
    componentWillReceiveProps(nextProps) {
        if(!this.props.shadowCard.pk_appregister){
            return;
        }
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
    createCards(cards, groupID) {
        let itemDoms = [];
        _.forEach(cards, (c) => {
            itemDoms.push(
                <Card dragCardID={-1} 
                type={c.apptype}
                {...c} 
                id={c.pk_appregister}
                groupID = {groupID}
                key={c.pk_appregister}
                />
            );
        });
        return itemDoms;
    }
    //向上移动组
	upGroupItem(groupID){
        let { groups } = this.props;
        groups = _.cloneDeep(groups);
		const groupIndex = utilService.getGroupIndexByGroupID(groups, groupID)
		if(groupIndex === 0){
			return;
		}
		const preGroup = groups[groupIndex-1]; 
		groups[groupIndex-1] = groups[groupIndex];
		groups[groupIndex] = preGroup;
		this.props.updateGroupList(groups);
    }
	//向下移动组
	downGroupItem(groupID){
        let { groups } = this.props;
        groups = _.cloneDeep(groups);
		const groupIndex = utilService.getGroupIndexByGroupID(groups, groupID)
		if(groupIndex === groups.length-1){
			return;
		}
		const nextGroup = groups[groupIndex + 1]; 
		groups[groupIndex+1] = groups[groupIndex];
		groups[groupIndex] = nextGroup;
		this.props.updateGroupList(groups);
	}
    //
    //删除组
	deleteGroupItem = (groupID)=>{
        let { groups } = this.props;
		groups = _.cloneDeep(groups);
		if (groups.length <= 1) {
			return;
		}
		_.remove(groups,(g)=>{
			return g.pk_app_group === groupID;
		})
		this.props.updateGroupList(groups);
    }
    //添加组
	addGroupItem(groupID) {
        let { groups } = this.props;
        groups = _.cloneDeep(groups);
		let insertIndex;
		_.forEach(groups, (g, i) => {
			if (g.pk_app_group === groupID) {
				insertIndex = i;
				return false;
			}
		})
		const tmpItem = {
			pk_app_group: "newGroupItem" + new Date().getTime(),
			groupname: `分组(${utilService.getAddedGroupItemCount(groups) + 1})`,
			type: "group",
			apps: []
		}
		groups.splice(insertIndex + 1, 0, tmpItem);
		this.props.updateGroupList(groups);
	}
    //获得组名
    getGroupName = (e) =>{
        let _groupName = e.target.value;
        // console.log(_groupName);
        this.setState({groupName: _groupName});
    }
    //组名进入编辑状态
	editGroupItemName(groupID) {
		this.props.updateCurrEditID(groupID);
	}
    //改变组名
	changeGroupName(groupID, groupname) {
        let { groups } = this.props;
        groups = _.cloneDeep(groups);
		_.forEach(groups, (g, i) => {
			if (g.pk_app_group === groupID) {
				g.groupname = groupname;
				return false;
			}
		});
		this.props.updateGroupList(groups);
		this.props.updateCurrEditID("");
    }
	//取消编辑组名
	cancelGroupName() {
		this.props.updateCurrEditID("");
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
    
    //已知放置格子数量, 计算容器的每一个格子多大
    calColWidth() {
        const { containerWidth, col, containerPadding, margin } = this.props.layout;

        if (margin) {
            return (containerWidth - containerPadding[0] * 2 -  margin[0] * (col + 1)) / col
        }
        return (containerWidth - containerPadding[0] * 2 - 0 * (col + 1)) / col
    }
    //已知格子大小，计算容器一行放置格子数量
    calColCount() {
        const { calWidth } = this.props.defaultLayout;
        const { containerWidth, containerPadding, margin } = this.props.layout;

        if (margin) {
            return Math.floor((containerWidth - containerPadding[0] * 2 -  margin[0])/(calWidth + margin[0])) ;
        }
    }

	componentDidMount() {
        let { layout } = this.props;
        layout = _.cloneDeep(layout);
		const containerDom = document.querySelector("#card-container");
		const clientWidth = containerDom.clientWidth;
        
        const windowWidth = window.innerWidth - 60*2;
        this.props.layout.containerWidth = windowWidth
        const col = this.calColCount();

        this.props.layout.col = col;
        this.props.layout.containerWidth = clientWidth;
        const calWidth = this.calColWidth();
        
        layout.calWidth = layout.rowHeight = calWidth;
        layout.col = col;
        layout.containerWidth = clientWidth;
        console.log(layout);
        this.props.updateLayout(layout);
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
                    <Input size="small" placeholder="占位符" defaultValue={groupname} onPressEnter={() => { this.changeGroupName(id, this.state.groupName) }} onChange={this.getGroupName.bind(this)} />
                    <Icon type="check-square-o" className="group-item-icon" title="占位符" onClick={() => { this.changeGroupName(id, this.state.groupName) }} />
                    <Icon type="close-square-o" className="group-item-icon" title="占位符" onClick={() => { this.cancelGroupName() }} />
                </div>
            </div>
        );
    }else{
        groupItemTitle = (
            <div className="group-item-title-container-no-edit" >
                <div class="title-left">
                {/* <Checkbox checked={}></Checkbox> */}
                    <span>{groupname}</span>
                </div>
                <div class="title-right">
                    <div className="group-item-title-edit" ><Icon type="edit" title="占位符" className="group-item-icon" onClick={() => { this.editGroupItemName(id) }} /></div>
                    <div className={index === 0 ? "group-item-title-not-edit" : "group-item-title-edit"}><Icon type="up-square-o" title="占位符" className="group-item-icon" onClick={() => { this.upGroupItem(id) }} /></div>
                    <div className={index === length - 1 ? "group-item-title-not-edit" : "group-item-title-edit"}><Icon type="down-square-o" title="占位符" className="group-item-icon" onClick={() => { this.downGroupItem(id) }} /></div>
                    <div className="group-item-title-edit"><Icon type="close-square-o" title="占位符" className="group-item-icon" onClick={() => { this.deleteGroupItem(id) }} /></div>
                </div>
            </div>
        );
    }
    
    return connectDragSource(connectDropTarget(
        <div className="group-item" style={{ opacity: opacity}}>
            <div className="group-item-container" style={{background: isOver ? 'rgb(172, 175, 175)' : '#ccc' }}>
                {groupItemTitle}
                <section id="card-container" style={{ height: containerHeight>defaultLayout.containerHeight?containerHeight:defaultLayout.containerHeight}}>
                    {this.createCards(cards, id)}
                </section>
            </div>

            <div>
                <Button className='group-item-add' onClick={()=>{this.addGroupItem(id)}}> + 添加分组</Button>
            </div>
        </div>
        ))
    }
}

const dragDropItem = DropTarget('item',groupItemTarget,collectTarget)(DragSource('item',groupItemSource,collectSource)(GroupItem));

export default (connect(
	(state) => ({
        groups: state.templateDragData.groups,
        shadowCard: state.templateDragData.shadowCard,
        layout: state.templateDragData.layout,
        defaultLayout: state.templateDragData.defaultLayout,
        defaultLayout: state.templateDragData.defaultLayout,
        currEditID: state.templateDragData.currEditID
	}),
	{
        updateGroupList,
        updateCurrEditID,
        updateLayout
	}
)(dragDropItem))