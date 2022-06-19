import {FB} from "@shared/fb";
import AuthConfig from "@configs/authentication";
import { EC_SITE } from "@models/site/enum"
import { userRepo } from "@repos/site/user.repo";
import { tikiTokenRepo } from "@repos/tiki/tikiTokens.repo";
import { sendoTokenRepo } from "@repos/sendo/sendoToken.repo";

async function getConnectedECSite (userId: string) {
  const connectedECSite: any = {};
  const user = await userRepo.getUserInfo({ _id: userId });
  if (user.fbAccessToken) {
    connectedECSite[EC_SITE.FACEBOOK.site] = {
      fbAccessToken: user.fbAccessToken,
      fbAccessToken_expire: user.fbAccessToken_expire
    };
  }

  const tikiToken = await tikiTokenRepo.findOne({ userId });
  if (tikiToken) {
    connectedECSite[EC_SITE.TIKI.site] = tikiToken;
  }

  const sendoToken = await sendoTokenRepo.findOne({ userId });
  if (sendoToken) {
    connectedECSite[EC_SITE.SENDO.site] = sendoToken;
  }
  return connectedECSite;
}

export default {
  getConnectedECSite
} as const;