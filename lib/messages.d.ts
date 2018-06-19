declare namespace NetworkMessages {
	namespace Player {
		export interface Movement {
			id: string;
			x: number;
			y: number;
			ang: number;
		}

		export interface List {
			[id: string]: {x: number, y: number}
		}

		export interface New {
			x: number;
			y: number;
			id: string;
		}

		export interface Destroy {
			id: string;
		}
	}
}