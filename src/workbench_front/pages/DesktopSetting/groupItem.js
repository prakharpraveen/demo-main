import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import { connect } from 'react-redux'
import { DragSource, DropTarget } from 'react-dnd'
import Card from './card'
import _ from 'lodash';
import {Icon,Input,Button,Checkbox } from 'antd';
import {collision,layoutCheck} from './collision';
import {compactLayout} from './compact.js';
import { updateCurrEditID} from 'Store/test/action';
import * as utilService from './utilService';

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

        // console.log(props);
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
            // console.log('card');
            const hoverItem = props;
            const {x,y}= monitor.getClientOffset();
            const groupItemBoundingRect = findDOMNode(component).getBoundingClientRect();
            const groupItemX = groupItemBoundingRect.left;
            const groupItemY = groupItemBoundingRect.top;
            props.moveCardInGroupItem(dragItem, hoverItem, x-groupItemX,y-groupItemY);
        }
    },
    drop(props, monitor, component){
        
        // console.log(props);
        //获取结果来判断是否冒泡,有结果时为冒泡
        // if (!_.isNull(monitor.getDropResult())) {
        //     return;
        // }
        const dragItem = monitor.getItem();
        const dropItem = props;
        if (dragItem.type === "group") {
            // console.log("group in dropGroup");
            props.onDrop(dragItem , dropItem);
        } else {
            // console.log(dragItem);
            // console.log("card in dropGroup");
        }
    }
}

@DropTarget('item',groupItemTarget,(connect, monitor )=>({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
}))
@DragSource('item',groupItemSource,(connect, monitor )=>({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
}))

class GroupItem extends Component {
    constructor(props) {
        super(props)
		this.state = {
            groupName:props.groupname
		}
    }
    //依靠前后props的isOver来判断enter和leave，但是不好用，enter检测不精准
    // componentWillReceiveProps(nextProps) {
    //     console.log(this.props.shadowCard.pk_appregister); 
    //     if(!this.props.shadowCard.pk_appregister){
    //         return;
    //     }
	// 	if (!this.props.isOver && nextProps.isOver) {
    //         // You can use this as enter handler
    //         // console.log("groupItem enter");
	// 	}

	// 	if (this.props.isOver && !nextProps.isOver) {
    //         // You can use this as leave handler
	// 		// console.log("groupItem leave");
	// 	}
    // }

    componentDidMount() {
        let clientWidth;
        const containerDom = document.querySelector("#card-container")
		if(containerDom){
            clientWidth = containerDom.clientWidth;
        }
        if(this.props.layout.containerWidth !== clientWidth){
            this.props.handleLoad();
            console.log('handle')
        }
    }
    // componentDidMount() {
    //     let { layout } = this.props;
    //     layout = _.cloneDeep(layout);
	// 	const containerDom = document.querySelector("#card-container");
    //     const clientWidth = containerDom.clientWidth;

    //     const windowWidth = window.innerWidth - 60*2;
    //     this.props.layout.containerWidth = windowWidth
    //     const col = this.calColCount();

    //     this.props.layout.col = col;
    //     this.props.layout.containerWidth = clientWidth;
    //     const calWidth = this.calColWidth();
        
    //     layout.calWidth = layout.rowHeight = calWidth;
    //     layout.col = col;
    //     layout.containerWidth = clientWidth;
    //     console.log('groupItem');
    //     this.props.updateLayout(layout);
    // }

    //创建卡片
    createCards(cards, groupID, index) {
        let itemDoms = [];
        _.forEach(cards, (c,i) => {
            itemDoms.push(
                <Card dragCardID={-1} 
                type={c.apptype}
                name = {c.name}
                id={c.pk_appregister}
                groupID = {groupID}
                groupIndex = {index}
                index={i}
                gridx = {c.gridx}
                gridy = {c.gridy}
                width = {c.width}
                height = {c.height}
                haspower = {c.haspower}
                isShadow = {c.isShadow}
                isChecked = {c.isChecked}
                key={`${groupID}_${c.pk_appregister}`}
                />
            );
        });
        return itemDoms;
    }
    //向上移动组
	upGroupItem = ()=>{
        this.props.upGroupItem(this.props.index);
    }
	//向下移动组
	downGroupItem = ()=>{
        this.props.downGroupItem(this.props.index);
	}
    //
    //删除组
	deleteGroupItem = ()=>{
        this.props.deleteGroupItem(this.props.id)
    }
    //添加组
	addGroupItem =()=> {
        // this.props.addGroupItem(this.props.id)
        this.props.addGroupItem(this.props.index)
	}
    //获得组名
    getGroupName = (e) =>{
        let _groupName = e.target.value;
        // console.log(_groupName);
        this.setState({groupName: _groupName});
    }
    //组名进入编辑状态
	editGroupItemName = ()=> {
        this.props.updateCurrEditID(this.props.id);
        setTimeout(() => {
            this.refs.editInputDom.focus();
          }, 0);
	}
    //改变组名
	changeGroupName =()=>{
        let index = this.props.index;
        let groupname =  this.state.groupName;
        this.props.changeGroupName(index,groupname)
    }
	//取消编辑组名
	cancelGroupName = ()=>{
		this.props.updateCurrEditID("");
    }

    render() {
    const {isDragging,connectDragSource,connectDropTarget, isOver, groupname, id,index,length, currEditID,defaultLayout,layout,cards } = this.props;
    const containerHeight = utilService.getContainerMaxHeight(cards, layout.rowHeight, layout.margin);
    const opacity = isDragging ? 0 : 1;
    // console.log('group')
    let groupItemTitle;
    if(currEditID === id){
        groupItemTitle = (
            <div className="group-item-title-container-no-edit">
                <div className="title-left">
                    <Input ref="editInputDom"
                     size="small" placeholder="分组名称" defaultValue={groupname} onPressEnter={this.changeGroupName} onChange={this.getGroupName} />
                    <Icon type="check-square-o" className="group-item-icon" title="确定" onClick={this.changeGroupName} />
                    <Icon type="close-square-o" className="group-item-icon" title="取消" onClick={this.cancelGroupName} />
                </div>
            </div>
        );
    }else{
        groupItemTitle = (
            <div className="group-item-title-container-no-edit" >
                <div className="title-left">
                {/* <Checkbox checked={}></Checkbox> */}
                    <span>{groupname}</span>
                </div>
                <div className="title-right">
                    <div className="group-item-title-edit" ><Icon type="edit" title="分组重命名" className="group-item-icon" onClick={this.editGroupItemName} /></div>
                    <div className={index === 0 ? "group-item-title-not-edit" : "group-item-title-edit"}><Icon type="up-square-o" title="分组上移" className="group-item-icon" onClick={this.upGroupItem} /></div>
                    <div className={index === length - 1 ? "group-item-title-not-edit" : "group-item-title-edit"}><Icon type="down-square-o" title="分组下移" className="group-item-icon" onClick={this.downGroupItem} /></div>
                    <div className="group-item-title-edit"><Icon type="close-square-o" title="分组删除" className="group-item-icon" onClick={this.deleteGroupItem} /></div>
                </div>
            </div>
        );
    }
    
    return connectDragSource(connectDropTarget(
        <div className="group-item" name={`a${id}`} style={{ opacity: opacity}}>
            <div className="group-item-container" style={{background: isOver ? 'rgb(204, 204, 204)' : 'rgba(79,86,98,.1)' }}>
                {groupItemTitle}
                <section id="card-container" style={{ height: containerHeight>defaultLayout.containerHeight?containerHeight:defaultLayout.containerHeight}}>
                    {this.createCards(cards, id, index)}
                </section>
            </div>

            <div>
                <Button className='group-item-add' onClick={this.addGroupItem}> + 添加分组</Button>
            </div>
        </div>
        ))
    }
}

// const dragDropItem = DropTarget('item',groupItemTarget,collectTarget)(DragSource('item',groupItemSource,collectSource)(GroupItem));

export default (connect(
	(state) => ({
        layout: state.templateDragData.layout,
        defaultLayout: state.templateDragData.defaultLayout,
        currEditID: state.templateDragData.currEditID,
        // shadowCard: state.templateDragData.shadowCard,
	}),
	{
        updateCurrEditID
	}
)(GroupItem))
