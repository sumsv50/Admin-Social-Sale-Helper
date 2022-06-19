/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import bcrypt from 'bcrypt'
import Admin from '@models/site/admin.model';
import { IAdmin } from '@models/site/admin.model';
const SALT_ROUNDS = 10;

class AdminRepo {
  async findOne(query: IAdmin) {
    const admin = await Admin.findOne(query).lean();
    return admin;
  }

  async findOrCreate (profile: any) {
    const { id, name, picture } = profile;
    let user = await Admin.findOne({ fbId: id });

    if (!user) {
      user = new Admin({ fbId: id, name, picture })
      await user.save();
    } else {
      user.picture = picture;
      await user.save();
    }

    return user;
  }

  async saveFBAccessToken(userId: string, accessToken: string, expire: number) {
    return await Admin.updateOne(
      { _id: userId },
      {
        $set: {
          fbAccessToken: accessToken,
          fbAccessToken_expire: expire,
        },
      }
    );
  }

  async savePageAccessToken(userId: string, accessToken: string) {
    return await Admin.updateOne(
      { _id: userId },
      {
        $set: {
          pageAccessToken: accessToken
        },
      }
    );
  }

  async checkCredential (username: string, password: string) {
    const admin = await this.findOne({ username });

    if (!admin || !admin.password) {
      return false;
    }
    if (!bcrypt.compareSync(password, admin.password)) {
      return false;
    }
    return admin;
  }

  async checkEmailIsExisted(email: string) {
    const user = await this.findOne({ email });
    return Boolean(user);
  }

  async createAdmin(email: string, password: string) {
    const hash = bcrypt.hashSync(password, SALT_ROUNDS);
    const user = await Admin.create({
      email,
      password: hash
    })
    
    return user;
  }

  async getAdminInfo(query: IAdmin) {
    const user = await Admin.findOne(query).select(['-password']).lean();
    return user;
  }

  async find(query: any) {
    return await Admin.find(query);
  }
}

const adminRepo = new AdminRepo();
export { adminRepo };