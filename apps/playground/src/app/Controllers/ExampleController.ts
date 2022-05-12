import { HttpContext } from '@fayona/core';
import {
  FromBody,
  FromRoute,
  HttpGet,
  HttpPatch,
  HttpPost,
  HttpPut,
  Route,
  SuccessResponse,
} from '@fayona/routing';
import { ProblemDetailsException } from 'rfc-7807-problem-details';

import {
  CreateExampleDto,
  GetExampleDto,
  ListExamplesDto,
  ReplaceExampleDto,
  UpdateExampleDto,
} from '../Dtos';
import { Example } from '../Models';

const store: Example[] = [];

@Route('example')
export class ExampleController {
  @HttpPost('/create')
  public CreateExample(@FromBody() dto: CreateExampleDto) {
    store.push(new Example(dto.name));
    return SuccessResponse.Created(dto);
  }

  @HttpPut('/replace')
  public ReplaceExample(
    @FromRoute('id') id: string,
    @FromBody() dto: ReplaceExampleDto
  ) {
    const existingExampleIndex = store.findIndex((it) => it.id === id);
    if (existingExampleIndex < 0) {
      return new ProblemDetailsException({
        type: 'not-found',
        status: 400,
        title: `Cannot fine an example with ${id}`,
      });
    }
    store.splice(existingExampleIndex, 1, new Example(dto.name));
    return SuccessResponse.Ok(dto);
  }

  @HttpPatch('/update')
  public UpdateExample(
    @FromRoute('id') id: string,
    @FromBody() dto: UpdateExampleDto
  ) {
    const existingExampleIndex = store.findIndex((it) => it.id === id);
    if (existingExampleIndex < 0) {
      return new ProblemDetailsException({
        type: 'not-found',
        status: 400,
        title: `Cannot fine an example with ${id}`,
      });
    }
    const existingExample = store[existingExampleIndex];
    existingExample.name = dto.name;
    return SuccessResponse.Ok(dto);
  }

  @HttpGet('/:id')
  public GetExample(@FromRoute('id') id: string) {
    const existingExampleIndex = store.findIndex((it) => it.id === id);
    if (existingExampleIndex < 0) {
      return new ProblemDetailsException({
        type: 'not-found',
        status: 400,
        title: `Cannot fine an example with ${id}`,
      });
    }
    const example = store[existingExampleIndex];
    return SuccessResponse.Ok(new GetExampleDto(example.name, example.id));
  }
  @HttpGet('/list')
  public ListExamples() {
    const examples = store;
    const listExamples = examples.map(
      (it) => new ListExamplesDto(it.name, it.id)
    );
    return SuccessResponse.Ok(listExamples);
  }
}
