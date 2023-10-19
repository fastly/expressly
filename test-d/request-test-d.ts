import { expectError, expectType } from 'tsd';
import { ERequest } from "../dist";
import { EConfig } from "../dist/lib/routing";
import { EReq } from "../dist/lib/routing/request";

// ERequest
expectError(ERequest())
expectError(new ERequest())
expectError(new ERequest({} as EConfig))
expectType<EReq>(new ERequest({} as EConfig, {} as FetchEvent))