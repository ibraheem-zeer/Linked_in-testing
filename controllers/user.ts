import { NSUser } from "../@types/user.js";
import { User } from "../db/entities/User.js";
import { EmployeeProfile } from "../db/entities/EmployeeProfile.js";
import { CompanyProfile } from "../db/entities/CompanyProfile.js";
import dataSource from "../db/dataSource.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';
import logger from 'morgan';
import { Role } from "../db/entities/Role.js";
import { Permission } from "../db/entities/permission.js";
import { In } from "typeorm";

const insertUser = (payload: NSUser.Item) => {
  return dataSource.manager.transaction(async transaction => {
    // search 
    const role = await Role.findOneBy({ name: payload.type })
    const newUser = User.create({
      ...payload,
      role: role as Role
    });
    await transaction.save(newUser);
    if (payload.type === 'employee') {
      const employee = EmployeeProfile.create({
        applications: [],
        cvUrl: payload.cvUrl || ''
      });
      employee.user = newUser;
      await transaction.save(employee);
    } else if (payload.type === 'employer') {
      const company = new CompanyProfile();
      company.user = newUser;
      company.description = payload.description || '';
      company.name = payload.fullName || '';
      await transaction.save(company);
    }
  });
}

const inssertRole = async (payload: NSUser.Role) => {
  try {
    const role = new Role()
    role.name = payload.name
    role.permissions = await Permission.findBy({
      id: In(payload.permissions)
    });
    role.save()
    return role;
  } catch (error) {
    throw ("Something went wrong")
  }
}

const insertPermission = async (payload: NSUser.Permission) => {
  try {
    const permission = Permission.create({
      name: payload.name
    })
    await permission.save();
    return permission
  } catch (error) {
    throw ("Something went wrong")
  }
}


const login = async (email: string, password: string) => {
  try {
    const user = await User.findOneBy({
      email
    });

    const passwordMatching = await bcrypt.compare(password, user?.password || '')

    if (user && passwordMatching) {
      const token = jwt.sign({
        email: user.email,
        fullName: user.fullName
      }, process.env.DB_JWT || '', {
        expiresIn: "30m"
      })
      console.log(token)
      return {
        token
        // user    also we can return user but not now :3
      }
    } else {
      throw ("invalid username or password")
    }
  } catch (error) {
  }
}

const getRoles = () => {
  return Role.find()
}

export { insertUser, login, insertPermission, inssertRole, getRoles }