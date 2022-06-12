export class GetExampleDto {
  name: string;
  id: string;
  street: boolean;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}
