/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import bcrypt from 'bcrypt'
import User from '@models/site/user.model';
import { IUser } from '@models/site/user.model';
const SALT_ROUNDS = 10;

class UserRepo {
  async findOne(query: IUser) {
    const user = await User.findOne(query).lean();
    return user;
  }

  async findAllPagination(query: object, page: number, itemPerPage: number) {
    const users = await User.paginate(query, {
      page: page,
      limit: itemPerPage,
      lean: true,
      select: ['-password'],
    })
    return users;
  }

  async updateOne(query: IUser, data: IUser) {
    return await User.updateOne(query, data);
  }

  async findOrCreate (profile: any): Promise<IUser> {
    const { id, name, picture } = profile;
    let user = await User.findOne({ fbId: id });

    if (!user) {
      user = new User({ fbId: id, name, picture })
      await user.save();
    } else {
      // user.picture = picture;
      await user.save();
    }

    return user;
  }

  async saveFBAccessToken(userId: string, accessToken: string, expire: number) {
    return await User.updateOne(
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
    return await User.updateOne(
      { _id: userId },
      {
        $set: {
          pageAccessToken: accessToken
        },
      }
    );
  }



  async checkEmailIsExisted(email: string) {
    const user = await this.findOne({ email });
    return Boolean(user);
  }

  async createUser(email: string, password: string) {
    const hash = bcrypt.hashSync(password, SALT_ROUNDS);
    const user = await User.create({
      email,
      password: hash
    })
    
    return user;
  }

  async getUserInfo(query: IUser): Promise<IUser> {
    const user = <IUser>(await User.findOne(query).select(['-password']).lean());
    return user;
  }

  async find(query: any) {
    return await User.find(query);
  }
}

const userRepo = new UserRepo();
export { userRepo };