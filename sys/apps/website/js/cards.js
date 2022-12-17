
export class CardSmall extends HTMLElement {
	constructor(item,config = 0) {
		super()
		this.config = config
		this.update(item)
	}
	async update(item) {
		let text = this.config ? this.config.text : true;
		let width = this.config && this.config.width ? this.config.width : "100%";
		this.item = item
		this.id = item ? item.uuid : 0
		if(!item) {
			this.innerHTML = ''
			return
		}
		this.innerHTML =
			`<div style="
				float:left;
				position:relative;
				margin: 16px 16px 16px 0px;
				padding:4px;
				width: ${width};
				background:#fffff8;
				border-radius:3px;
				xborder:3px solid #e0e0e0;
				box-shadow: 3px 3px 10px 0 rgba(0,0,0,0.35);
				transition: all .20s linear;
				"
				onMouseOver="this.style.transform='scale(1.05)'"
				onMouseOut="this.style.transform='scale(1.0)'"
				>
					<a style="
					display:flex;
					"
					href="${item.url}"
					>
						<div style="
							flex: 1;
							min-height: 100px;
							border:1px solid #e0e0e0;
							background-image: url(${item.art});
							background-size: cover;
							background-repeat: no-repeat;
							background-position: center center;
							border-radius: 3%;
							">
						</div>
						${ text ?
						`<div style="
							flex: 4;
							padding: 0 8px 0 8px;
							color:black;
							">
							<h3>${item.label}</h3>
							<h4/>${item.about}</h4>
						</div>` : "" }
					</a>
					<div style="color:black">${item.info?item.info:''}</div>
			</div>`
	}
}

customElements.define('card-small', CardSmall )
window.CardSmall = CardSmall

export class CardSmallCollection extends HTMLElement {
	constructor(query,config) {
		super()
		this.query = query
		this.config = config
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
						candidate = new CardSmall(item,this.config)
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
				this.appendChild(new CardSmall(item,this.config))
			}

		})
	}
}

customElements.define('card-small-collection', CardSmallCollection )
window.CardSmallCollection = CardSmallCollection

