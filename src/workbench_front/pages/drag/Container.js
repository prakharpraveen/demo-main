import React, { Component } from 'react'
import update from 'immutability-helper'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Card from './Card'
import _ from 'lodash';
const style = {
	width: 400,
}
class Container extends Component {
	constructor(props) {
		super(props)
		this.moveCard = this.moveCard.bind(this)
		this.state = {
			cards: [
				{
					id: 1,
					text: 'Write a cool JS library',
				},
				{
					id: 2,
					text: 'Make it generic enough',
				},
				{
					id: 3,
					text: 'Write README',
				},
				{
					id: 4,
					text: 'Create some examples',
				},
				{
					id: 5,
					text:
						'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
				},
				{
					id: 6,
					text: '???',
				},
				{
					id: 7,
					text: 'PROFIT',
				},
			],
		}
	}

	moveCard(dragIndex, hoverIndex) {
		const { cards } = this.state
		const dragCard = cards[dragIndex]

		this.setState(
			update(this.state, {
				cards: {
					$splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
				},
			}),
		)
	}
	// }
	// moveCard(dragIndex, hoverIndex) {
	// 	let { cards } = this.state;
	// 	cards = _.cloneDeep(cards);
	// 	const dragCard = cards[dragIndex];
	// 	cards.splice(dragIndex, 1);
	// 	cards.splice(hoverIndex, 0, dragCard);
	// 	this.setState({cards});
	// }
	// moveCard(dragIndex, hoverIndex) {
	// 	let { cards } = this.state;
	// 	const dragCard = cards[dragIndex];
	// 	cards.splice(dragIndex, 1);
	// 	cards.splice(hoverIndex, 0, dragCard);
	// 	this.setState({ cards: cards });
	// 	console.log(cards)
	// }
	getDom(cards){
		let itemDoms = [];
		_.forEach(cards, (card, i) => {
			itemDoms.push(<Card
				key={card.id}
				index={i}
				id={card.id}
				text={card.text}
				length={cards.length}
				moveCard={this.moveCard}
			/>);
		});
		return itemDoms;
	}
	render() {
		const { cards } = this.state
		const aaaa = this.getDom(cards) 
		return (
			<div style={style}>
				{aaaa}
			</div>
		)
	}
} 


export default DragDropContext(HTML5Backend)(Container);
	