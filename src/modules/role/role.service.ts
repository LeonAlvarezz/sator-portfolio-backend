import { PermissionFlagRepository } from "@/repositories/permission-flag.repository";
import { ResourceRepository } from "@/repositories/resource.repository";
import { RoleRepository } from "@/modules/role/role.repository";
import type { BaseModel } from "@/core/types/base.type";
import type { CheckRole, CreateRole, UpdateRole } from "@/types/role.type";
import { db } from "@/db";
import { ForbiddenException } from "@/core/response/error/exception";

export class RoleService {
  private roleRepository: RoleRepository;
  private resourceRepository: ResourceRepository;
  private permissionFlagRepository: PermissionFlagRepository;
  constructor() {
    this.roleRepository = new RoleRepository();
    this.resourceRepository = new ResourceRepository();
    this.permissionFlagRepository = new PermissionFlagRepository();
  }

  public async findAll() {
    return await this.roleRepository.findAll();
  }

  public async findById(payload: BaseModel) {
    return await this.roleRepository.findById(payload.id as string);
  }

  public async create(payload: CreateRole) {
    return await db.transaction(async (tx) => {
      const role = await this.roleRepository.create(payload, tx);

      const permissionPromises = payload.permissions.map((permission) =>
        this.permissionFlagRepository.create(role.id, permission, tx)
      );
      await Promise.all(permissionPromises);

      return role;
    });
  }
  public async update(role_id: string, payload: UpdateRole) {
    return await db.transaction(async (tx) => {
      const role = await this.roleRepository.findById(role_id, tx);
      if (!role) {
        throw new ForbiddenException({ message: "Role not accessible" });
      }
      const permissionPromises = payload.permissions.map((permission) =>
        this.permissionFlagRepository.upsert(role.id, permission, tx)
      );
      await Promise.all(permissionPromises);

      return role;
    });
  }
  public async delete(payload: BaseModel) {
    return this.roleRepository.delete(payload.id as string);
  }
  public async check(payload: CheckRole) {
    const role = await this.roleRepository.findById(payload.role_id);
    const resource = await this.resourceRepository.findByName(payload.resource);
    if (!role) {
      throw new ForbiddenException({ message: "Role not accessible" });
    }
    const permission = role.permission_flags.find(
      (p) => p.resource_id === resource?.id
    );
    if (!permission) {
      throw new ForbiddenException({ message: "You have no permission" });
    }

    const actionAllowed = permission["read"];
    if (!actionAllowed) {
      throw new ForbiddenException({ message: "You have no permission" });
    }
    return role;
  }
}
