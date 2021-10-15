export class Event implements MapboxPromoted.Event {
  public type: MapboxPromoted.EventTypes;
  public data: Object;

  constructor(type: MapboxPromoted.EventTypes, data: Object = {}) {
    this.type = type;
    this.data = data;
  }
}
