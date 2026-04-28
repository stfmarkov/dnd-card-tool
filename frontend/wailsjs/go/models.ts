export namespace main {
	
	export class CardData {
	    id: string;
	    name: string;
	    typeLine: string;
	    description: string;
	    footerText: string;
	    rarity: string;
	    artwork: string;
	
	    static createFrom(source: any = {}) {
	        return new CardData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.typeLine = source["typeLine"];
	        this.description = source["description"];
	        this.footerText = source["footerText"];
	        this.rarity = source["rarity"];
	        this.artwork = source["artwork"];
	    }
	}
	export class SaveCardDataRequest {
	    name: string;
	    typeLine: string;
	    description: string;
	    footerText: string;
	    rarity: string;
	    artwork: string;
	
	    static createFrom(source: any = {}) {
	        return new SaveCardDataRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.typeLine = source["typeLine"];
	        this.description = source["description"];
	        this.footerText = source["footerText"];
	        this.rarity = source["rarity"];
	        this.artwork = source["artwork"];
	    }
	}

}

