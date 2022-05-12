export class Example {
  name: string;
  id: string;

  constructor(name: string) {
    this.name = name;
    this.id = randomId();
  }
}

function randomId() {
  return Math.random().toString(36).substring(2, 7);
}
