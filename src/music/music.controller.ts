// import { Controller, Get, Res, HttpCode, Header, Req } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { MusicService } from './music.service';
// import { Request } from 'express';

// import * as fs from "fs";

@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {
  }

  @Get('nextMusic')
  async getNextMusic(): Promise<object> {
    // console.log(global['nestHttpServer'].getUrl());
    // const url = await global['nestHttpServer'].getUrl();
    // await global['nestHttpServer'].getUrl().then((o)=>{console.log(o);})
    // console.log(url);
    // console.log(global['nestHttpServer']);
    return this.musicService.getNextMusic();
  }

  // @Get()
  // findAll(): string {
  //     return "a";
  // }

  // @Get()
  // @Header('Content-Type', 'audio/mpeg')
  // // @HttpCode(206)
  // findAll(@Req() request: Request,@Res() res): void {
  //   // async findAll(): Promise<string> {
  //   this.index++;
  //   const name = ((this.index) % 8).toString() + '.mp3';
  //   console.log('--------------')
  //   console.log(request.headers.range);
  //   console.log(name);
  //   console.log('next route');
  //   // for( let i = 0; i < 1600000000; i++)
  //   // {
  //   //   if(i===1000) console.log('aaaa');
  //   // }
  //   // console.log('done')

  //   res.sendFile(name, { root: './public'});
  //   // const rstream = fs.createReadStream('./public/' + name);
  //   // rstream.pipe(res);
  //   // res.end();
  //   // fs.readFile('./public/' + name,  (err, data) =>{
  //   //   res.end(data);
  //   // })
  // //  return name;
  // // return new Promise(resolve => {
  // //   this.index++;
  // //   const name = ((this.index) % 8).toString() + '.mp3';
  // //   console.log(name);
  // //   console.log('next route');
  // //   for( let i = 0; i < 1600000000; i++)
  // //   {
  // //     if(i===1000) console.log('aaaa');
  // //   }
  // //       console.log('done');
  // //   resolve(name);
  // // });
  // console.log('***********')
  // }

  // // @Get('next')
  // // getNextMusic(@Res() res): Promise<void> {
  // //   this.index++;
  // //   const name = ((this.index) % 2).toString() + '.mp3';
  // //   console.log(name);
  // //   console.log('next route');
  // //   return res.sendFile('name.mp3', { root: './public' });
  // // }
}





// NestApplication {
//   container:
//    NestContainer {
//      _applicationConfig:
//       ApplicationConfig {
//         ioAdapter: null,
//         globalPrefix: '',
//         globalPipes: [],
//         globalFilters: [],
//         globalInterceptors: [],
//         globalGuards: [],
//         globalRequestPipes: [],
//         globalRequestFilters: [],
//         globalRequestInterceptors: [],
//         globalRequestGuards: [] },
//      globalModules: Set { [Module] },
//      moduleTokenFactory: ModuleTokenFactory { moduleIdsCache: [WeakMap] },
//      moduleCompiler: ModuleCompiler { moduleTokenFactory: [ModuleTokenFactory] },
//      modules:
//       ModulesContainer [Map] {
//         '2e9c86a78821aec44fd7e365670b00badcf76ddb' => [Module],
//         '7ca89be85461ed2c5cd43a8a640914547220d6e0' => [Module],
//         'dd728e2d4125bc323dfdf89018bec75a47d57468' => [Module],
//         InternalCoreModule: [Module] },
//      dynamicModulesMetadata:
//       Map { '2e9c86a78821aec44fd7e365670b00badcf76ddb' => [Object] },
//      internalProvidersStorage:
//       InternalProvidersStorage {
//         _httpAdapterHost: [HttpAdapterHost],
//         _httpAdapter: [ExpressAdapter] },
//      internalCoreModule:
//       Module {
//         _metatype: [Function: InternalCoreModule],
//         _scope: [],
//         container: [Circular],
//         _imports: Set {},
//         _providers: [Map],
//         _injectables: Map {},
//         _middlewares: Map {},
//         _controllers: Map {},
//         _exports: [Set],
//         _distance: 0,
//         _id: '183b8651-3a90-4e21-81b5-0a148fbf9196' } },
//   scope: [],
//   contextModule:
//    Module {
//      _metatype: [Function: InternalCoreModule],
//      _scope: [],
//      container:
//       NestContainer {
//         _applicationConfig: [ApplicationConfig],
//         globalModules: [Set],
//         moduleTokenFactory: [ModuleTokenFactory],
//         moduleCompiler: [ModuleCompiler],
//         modules: [ModulesContainer],
//         dynamicModulesMetadata: [Map],
//         internalProvidersStorage: [InternalProvidersStorage],
//         internalCoreModule: [Circular] },
//      _imports: Set {},
//      _providers:
//       Map {
//         'InternalCoreModule' => [InstanceWrapper],
//         'ModuleRef' => [InstanceWrapper],
//         'ApplicationConfig' => [InstanceWrapper],
//         'Reflector' => [InstanceWrapper],
//         Symbol(REQUEST) => [InstanceWrapper],
//         Symbol(INQUIRER) => [InstanceWrapper],
//         'ExternalContextCreator' => [InstanceWrapper],
//         'ModulesContainer' => [InstanceWrapper],
//         'HttpAdapterHost' => [InstanceWrapper] },
//      _injectables: Map {},
//      _middlewares: Map {},
//      _controllers: Map {},
//      _exports:
//       Set {
//         'Reflector',
//         Symbol(REQUEST),
//         Symbol(INQUIRER),
//         'ExternalContextCreator',
//         'ModulesContainer',
//         'HttpAdapterHost' },
//      _distance: 0,
//      _id: '183b8651-3a90-4e21-81b5-0a148fbf9196' },
//   isInitialized: true,
//   injector: Injector {},
//   activeShutdownSignals: [],
//   containerScanner:
//    ContainerScanner {
//      container:
//       NestContainer {
//         _applicationConfig: [ApplicationConfig],
//         globalModules: [Set],
//         moduleTokenFactory: [ModuleTokenFactory],
//         moduleCompiler: [ModuleCompiler],
//         modules: [ModulesContainer],
//         dynamicModulesMetadata: [Map],
//         internalProvidersStorage: [InternalProvidersStorage],
//         internalCoreModule: [Module] } },
//   httpAdapter:
//    ExpressAdapter {
//      instance:
//       { [EventEmitter: app]
//         _events: [Object],
//         _eventsCount: 1,
//         _maxListeners: undefined,
//         setMaxListeners: [Function: setMaxListeners],
//         getMaxListeners: [Function: getMaxListeners],
//         emit: [Function: emit],
//         addListener: [Function: addListener],
//         on: [Function: addListener],
//         prependListener: [Function: prependListener],
//         once: [Function: once],
//         prependOnceListener: [Function: prependOnceListener],
//         removeListener: [Function: removeListener],
//         off: [Function: removeListener],
//         removeAllListeners: [Function: removeAllListeners],
//         listeners: [Function: listeners],
//         rawListeners: [Function: rawListeners],
//         listenerCount: [Function: listenerCount],
//         eventNames: [Function: eventNames],
//         init: [Function: init],
//         defaultConfiguration: [Function: defaultConfiguration],
//         lazyrouter: [Function: lazyrouter],
//         handle: [Function: handle],
//         use: [Function: use],
//         route: [Function: route],
//         engine: [Function: engine],
//         param: [Function: param],
//         set: [Function: set],
//         path: [Function: path],
//         enabled: [Function: enabled],
//         disabled: [Function: disabled],
//         enable: [Function: enable],
//         disable: [Function: disable],
//         acl: [Function],
//         bind: [Function],
//         checkout: [Function],
//         connect: [Function],
//         copy: [Function],
//         delete: [Function],
//         get: [Function],
//         head: [Function],
//         link: [Function],
//         lock: [Function],
//         'm-search': [Function],
//         merge: [Function],
//         mkactivity: [Function],
//         mkcalendar: [Function],
//         mkcol: [Function],
//         move: [Function],
//         notify: [Function],
//         options: [Function],
//         patch: [Function],
//         post: [Function],
//         propfind: [Function],
//         proppatch: [Function],
//         purge: [Function],
//         put: [Function],
//         rebind: [Function],
//         report: [Function],
//         search: [Function],
//         source: [Function],
//         subscribe: [Function],
//         trace: [Function],
//         unbind: [Function],
//         unlink: [Function],
//         unlock: [Function],
//         unsubscribe: [Function],
//         all: [Function: all],
//         del: [Function],
//         render: [Function: render],
//         listen: [Function: listen],
//         request: [IncomingMessage],
//         response: [ServerResponse],
//         cache: {},
//         engines: {},
//         settings: [Object],
//         locals: [Object],
//         mountpath: '/',
//         _router: [Function] },
//      routerMethodFactory: RouterMethodFactory {},
//      httpServer:
//       Server {
//         _events: [Object],
//         _eventsCount: 2,
//         _maxListeners: undefined,
//         _connections: 2,
//         _handle: [TCP],
//         _usingWorkers: false,
//         _workers: [],
//         _unref: false,
//         allowHalfOpen: true,
//         pauseOnConnect: false,
//         httpAllowHalfOpen: false,
//         timeout: 120000,
//         keepAliveTimeout: 5000,
//         maxHeadersCount: null,
//         headersTimeout: 40000,
//         _connectionKey: '6::::9999',
//         [Symbol(IncomingMessage)]: [Function],
//         [Symbol(ServerResponse)]: [Function],
//         [Symbol(asyncId)]: 16 } },
//   config:
//    ApplicationConfig {
//      ioAdapter: null,
//      globalPrefix: '',
//      globalPipes: [],
//      globalFilters: [],
//      globalInterceptors: [],
//      globalGuards: [],
//      globalRequestPipes: [],
//      globalRequestFilters: [],
//      globalRequestInterceptors: [],
//      globalRequestGuards: [] },
//   appOptions: { cors: true },
//   logger:
//    Logger { context: 'NestApplication', isTimestampEnabled: true },
//   middlewareModule:
//    MiddlewareModule {
//      routerProxy: RouterProxy {},
//      exceptionFiltersCache: WeakMap { [items unknown] },
//      routerExceptionFilter:
//       RouterExceptionFilters {
//         container: [NestContainer],
//         config: [ApplicationConfig],
//         applicationRef: [ExpressAdapter] },
//      routesMapper: RoutesMapper { routerExplorer: [RouterExplorer] },
//      resolver:
//       MiddlewareResolver {
//         middlewareContainer: [MiddlewareContainer],
//         instanceLoader: Injector {} },
//      config:
//       ApplicationConfig {
//         ioAdapter: null,
//         globalPrefix: '',
//         globalPipes: [],
//         globalFilters: [],
//         globalInterceptors: [],
//         globalGuards: [],
//         globalRequestPipes: [],
//         globalRequestFilters: [],
//         globalRequestInterceptors: [],
//         globalRequestGuards: [] },
//      injector: Injector {},
//      container:
//       NestContainer {
//         _applicationConfig: [ApplicationConfig],
//         globalModules: [Set],
//         moduleTokenFactory: [ModuleTokenFactory],
//         moduleCompiler: [ModuleCompiler],
//         modules: [ModulesContainer],
//         dynamicModulesMetadata: [Map],
//         internalProvidersStorage: [InternalProvidersStorage],
//         internalCoreModule: [Module] } },
//   middlewareContainer:
//    MiddlewareContainer {
//      container:
//       NestContainer {
//         _applicationConfig: [ApplicationConfig],
//         globalModules: [Set],
//         moduleTokenFactory: [ModuleTokenFactory],
//         moduleCompiler: [ModuleCompiler],
//         modules: [ModulesContainer],
//         dynamicModulesMetadata: [Map],
//         internalProvidersStorage: [InternalProvidersStorage],
//         internalCoreModule: [Module] },
//      middleware:
//       Map {
//         '2e9c86a78821aec44fd7e365670b00badcf76ddb' => Map {},
//         '7ca89be85461ed2c5cd43a8a640914547220d6e0' => Map {},
//         'dd728e2d4125bc323dfdf89018bec75a47d57468' => Map {} },
//      configurationSets: Map {} },
//   microservicesModule: undefined,
//   socketModule: undefined,
//   microservices: [],
//   isListening: true,
//   httpServer:
//    Server {
//      _events:
//       [Object: null prototype] {
//         request: [EventEmitter],
//         connection: [Function: connectionListener] },
//      _eventsCount: 2,
//      _maxListeners: undefined,
//      _connections: 2,
//      _handle:
//       TCP {
//         reading: false,
//         onread: null,
//         onconnection: [Function: onconnection],
//         [Symbol(owner)]: [Circular] },
//      _usingWorkers: false,
//      _workers: [],
//      _unref: false,
//      allowHalfOpen: true,
//      pauseOnConnect: false,
//      httpAllowHalfOpen: false,
//      timeout: 120000,
//      keepAliveTimeout: 5000,
//      maxHeadersCount: null,
//      headersTimeout: 40000,
//      _connectionKey: '6::::9999',
//      [Symbol(IncomingMessage)]: { [Function: IncomingMessage] super_: [Function] },
//      [Symbol(ServerResponse)]: { [Function: ServerResponse] super_: [Function] },
//      [Symbol(asyncId)]: 16 },
//   routesResolver:
//    RoutesResolver {
//      container:
//       NestContainer {
//         _applicationConfig: [ApplicationConfig],
//         globalModules: [Set],
//         moduleTokenFactory: [ModuleTokenFactory],
//         moduleCompiler: [ModuleCompiler],
//         modules: [ModulesContainer],
//         dynamicModulesMetadata: [Map],
//         internalProvidersStorage: [InternalProvidersStorage],
//         internalCoreModule: [Module] },
//      config:
//       ApplicationConfig {
//         ioAdapter: null,
//         globalPrefix: '',
//         globalPipes: [],
//         globalFilters: [],
//         globalInterceptors: [],
//         globalGuards: [],
//         globalRequestPipes: [],
//         globalRequestFilters: [],
//         globalRequestInterceptors: [],
//         globalRequestGuards: [] },
//      injector: Injector {},
//      logger:
//       Logger { context: 'RoutesResolver', isTimestampEnabled: true },
//      routerProxy: RouterProxy {},
//      routerExceptionsFilter:
//       RouterExceptionFilters {
//         container: [NestContainer],
//         config: [ApplicationConfig],
//         applicationRef: [ExpressAdapter],
//         moduleContext: undefined },
//      routerBuilder:
//       RouterExplorer {
//         metadataScanner: MetadataScanner {},
//         container: [NestContainer],
//         injector: Injector {},
//         routerProxy: RouterProxy {},
//         exceptionsFilter: [RouterExceptionFilters],
//         routerMethodFactory: RouterMethodFactory {},
//         logger: [Logger],
//         exceptionFiltersCache: [WeakMap],
//         executionContextCreator: [RouterExecutionContext] } } }
// http://localhost:9999/music/1.mp3

