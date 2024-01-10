import { expectType } from 'tsd';
import { Router } from "../dist";
import { EReq } from "../dist/lib/routing/request";
import { ERes } from '../dist/lib/routing/response';

// Default Req and Res types
{
  const router = new Router();
  router.all('/', async (req, res) => {
    expectType<EReq>(req)
    expectType<ERes>(res)
    return res.send("Hello world!");
  });
  router.get('/', async (req, res) => {
    expectType<EReq>(req)
    expectType<ERes>(res)
    return res.send("Hello world!");
  });
}

// Custom Req and Res types
{
  interface MeowReq extends EReq {
    meow(): string
  }

  interface WoofReq extends EReq {
    woof(): string
  }

  interface MyReq extends MeowReq, WoofReq { }

  interface WoofRes extends ERes {
    woof(): string
  }

  const router = new Router<MyReq, WoofRes>();
  router.all('/', async (req, res) => {
    expectType<MyReq>(req)
    expectType<WoofRes>(res)
    req.meow()
    req.woof()
    res.woof()
    return res.send("Hello world!");
  });
  router.get('/', async (req, res) => {
    expectType<MyReq>(req)
    expectType<WoofRes>(res)
    res.on('finish', finalResponse => {
      expectType<Response | undefined>(finalResponse)
    })
    return res.send("Hello world!")
  });
}