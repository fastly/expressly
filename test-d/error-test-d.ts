import { expectType } from 'tsd';
import { Router } from "../dist";
import { EReq } from "../dist/lib/routing/request";
import { ERes } from '../dist/lib/routing/response';
import { EErr } from "../dist/lib/routing/errors";

// Default Err types
{
  const router = new Router();
  router.use(async (err, _, res) => {
    expectType<EErr>(err)
  });
}

// Custom Req and Res types
{
  interface MeowErr extends EErr {
    meow(): string
  }

  interface WoofErr extends EErr {
    woof(): string
  }

  interface MyErr extends MeowErr, WoofErr { }

  const router = new Router<EReq,ERes,MyErr>();
  router.use(async (err, _, res) => {
    expectType<MyErr>(err)
    err.meow()
    err.woof()
  });

}