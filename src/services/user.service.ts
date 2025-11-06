import { UserRepository } from "@/repositories/user.repository";
import { type UserFilter } from "@/types/user.type";
import { getPaginationMetadata } from "@/utils/pagination";
import { CacheService } from "./cache.service";
import { db } from "@/db";
import { AuthService } from "@/modules/auth/auth.service";
import type { Signin } from "@/modules/auth/dto/sign-in.dto";
import type { Signup } from "@/modules/auth/dto/sign-up.dto";
import type { SessionResponse } from "@/modules/auth/dto/session-response.dto";
import type { Auth } from "@/modules/auth/model/auth.model";

export class UserService {
  private _userRepository: UserRepository;
  private _cacheService: CacheService;
  private readonly authService: AuthService;

  constructor() {
    this._userRepository = new UserRepository();
    this._cacheService = new CacheService();
    this.authService = new AuthService();
  }

  public async getUsers() {
    return await this._userRepository.findAll();
  }

  public async paginateUsers(filter: UserFilter) {
    const count = await this._userRepository.count(filter);
    const { current_page, page_size, page } = getPaginationMetadata(
      filter,
      count
    );
    const users = await this._userRepository.paginate(filter);
    return { data: users, metadata: { count, current_page, page_size, page } };
  }

  public async signup(payload: Signup): Promise<void> {
    await db.transaction(async (tx) => {
      const auth = await this.authService.create(payload, tx);
      // const auth = await this._authRepository.createAuth(
      //   {
      //     email: payload.email,
      //     password: passwordHash,
      //   },
      //   tx
      // );
      await this._userRepository.addUser(
        {
          username: payload.username,
        },
        auth.id as string,
        tx
      );
    });
  }

  public async signin(payload: Signin): Promise<SessionResponse> {
    return await this.authService.signin(payload);
  }

  public async getMe(token: string): Promise<Auth> {
    return await this.authService.getMe(token);
  }
}
