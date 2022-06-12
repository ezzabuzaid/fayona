import { HttpContext, IHttpContext } from '@fayona/core';
import {
  OpenApiObsolete,
  OpenApiOperation,
  OpenApiParameter,
  OpenApiRequestBody,
} from '@fayona/openapi';
import {
  FromBody,
  FromQuery,
  FromRoute,
  HttpGet,
  HttpPatch,
  HttpPost,
  HttpPut,
  HttpResponse,
  Route,
  SuccessResponse,
} from '@fayona/routing';
import { ProblemDetailsException } from 'rfc-7807-problem-details';
import { Inject } from 'tiny-injector';

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
  constructor(@Inject(HttpContext) private httpContext: IHttpContext) {}
  @HttpGet('/two')
  public GetSecondExample(): HttpResponse<ReplaceExampleDto> {
    const example = store[0];
    return SuccessResponse.Ok(example);
  }
  @HttpGet('/')
  public GetFirstExample(
    @FromQuery('ss') examplesasss: string
  ): Promise<HttpResponse<ReplaceExampleDto>> {
    const example = store[0];
    return Promise.resolve(
      SuccessResponse.Ok(new GetExampleDto(example.name, example.id))
    );
  }
  @HttpGet('/:id')
  public GetExample(
    @FromRoute('id') id: string,
    @FromQuery() examplesasss: Example
  ): Promise<HttpResponse<GetExampleDto>> {
    const existingExampleIndex = store.findIndex((it) => it.id === id);
    if (existingExampleIndex < 0) {
      throw new ProblemDetailsException({
        type: 'not-found',
        status: 400,
        title: `Cannot find an example with ${id}`,
      });
    }
    const example = store[existingExampleIndex];
    return Promise.resolve(
      SuccessResponse.Ok(new GetExampleDto(example.name, example.id))
    );
  }
  @HttpPost('/create')
  @OpenApiOperation({
    Summary: 'Example Summary',
    Description: 'Example Description',
  })
  public CreateExample(
    @FromBody()
    dto: CreateExampleDto
  ): HttpResponse<Example> {
    store.push(new Example(dto.name));
    return SuccessResponse.Created(dto);
  }

  @HttpPut('/replace/:id')
  public ReplaceExample(
    @OpenApiObsolete()
    @OpenApiParameter('Test Param Message', false)
    @FromRoute('test')
    test: number,
    @FromRoute('id') id: string,
    @OpenApiRequestBody('Custom Request Body Description', false)
    @FromBody()
    dto: ReplaceExampleDto
  ): HttpResponse<Example> {
    const existingExampleIndex = store.findIndex((it) => it.id === id);
    if (existingExampleIndex < 0) {
      throw new ProblemDetailsException({
        type: 'not-found',
        status: 400,
        title: `Cannot find an example with ${id}`,
      });
    }
    store.splice(existingExampleIndex, 1, new Example(dto.name));
    return SuccessResponse.Ok<Example>(store[existingExampleIndex]);
  }

  @HttpPatch('/update')
  public UpdateExample(
    @FromRoute('id') id: string,
    @FromBody() dto: UpdateExampleDto
  ): HttpResponse<UpdateExampleDto> {
    const existingExampleIndex = store.findIndex((it) => it.id === id);
    if (existingExampleIndex < 0) {
      throw new ProblemDetailsException({
        type: 'not-found',
        status: 400,
        title: `Cannot find an example with ${id}`,
      });
    }
    const existingExample = store[existingExampleIndex];
    existingExample.name = dto.name;
    return SuccessResponse.Ok(dto);
  }

  @HttpGet('/list')
  public ListExamples(): HttpResponse<Array<ListExamplesDto>> {
    const examples = store;
    const listExamples = examples.map(
      (it) => new ListExamplesDto(it.name, it.id)
    );
    return SuccessResponse.Ok<ListExamplesDto[]>(listExamples);
  }
}
