
export class CardSmall extends HTMLElement {
	constructor(item,config = 0) {
		super()
		this.config = config
		this.update(item)
	}
	async update(item) {
		let width = this.config && this.config.width ? this.config.width : "256px";
		this.item = item
		this.id = item ? item.uuid : 0
		if(!item) {
			this.innerHTML = ''
			return
		}
		this.innerHTML =
			`<div style="
				border:3px solid #e0e0e0;
				box-shadow: 3px 3px 10px 0 rgba(0,0,0,0.35);
		        transition: all .20s linear;
				width:${width};
				background:white;
				overflow:hidden;
				display:inline-block;
				box-sizing:border-box;
				margin:4px;
				padding:4px;
				border-radius:5px;
				"
				onMouseOver="this.style.transform='scale(1.05)'"
				onMouseOut="this.style.transform='scale(1.0)'"
				>
				<a href="${item.url}">${item.label}</a>
					<div style="
						border:1px solid #e0e0e0;
						height:82px;
						background-image: url(${item.art});
						background-size: cover;
						background-repeat: no-repeat;
						background-position: center center;
						">
					</div>
				</div>`
	}
}

customElements.define('card-small', CardSmall )
window.CardSmall = CardSmall

export class CardSmallCollection extends HTMLElement {
	constructor(query) {
		super()
		this.query = query
	}
	connectedCallback() {
		this.query.observe( this.observer.bind(this) )
	}
	disconnectedCallback() {
		this.query.release( this.observer )
	}
	observer(changes) {

		let offset = this.query && this.query.offset ? this.query.offset : 0
		let limit = this.query && this.query.limit ? this.query.limit : 10

		changes.forEach(item=>{

			// removal? note this can make the list smaller which may not be a desired visual effect
			if(item.event == "delete") {
				let candidate = this.getElementById(item.uuid)
				if(candidate) candidate.remove()
				return
			}

			// walk existing candidates to insert in timewise order
			for(let i = 0; this.children && i < this.children.length; i++) {
				let elem = this.children[i]

				// find correct slot to insert at
				if(elem.item && elem.item.uuid && item.updated > elem.item.updated) {
					// was just an update?
					if(item.uuid == elem.item.uuid) {
						elem.item.update(item)
						return
					}
					// has to be moved?
					let candidate = this.getElementById(item.uuid)
					if(candidate) {
						candidate.remove()
						candidate.item.update(item)
					}
					// has to be created
					else {
						candidate = new CardSmall(item)
					}
					// place
					this.insertBefore(candidate,elem)
					return
				}
			}

			// add change but only if there is room
			if(!limit || this.children.length < limit) {
				let candidate = this.querySelector(`#${item.uuid}`)
				if(candidate) return // it did exist but it is newer
				this.appendChild(new CardSmall(item))
			}

		})
	}
}

customElements.define('card-small-collection', CardSmallCollection )
window.CardSmallCollection = CardSmallCollection

