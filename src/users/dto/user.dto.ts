export class RegUserDto {
    username: string;
    password: string;
    email: string;
}

export class ForgetPasswordDto {
    username: string;
    email: string;
}

export class ResetPasswordDto {
    key: string;
}

export class EditPasswordDto {
    password: string;
}

export class DetailUserDto {
    // username: string;
    userId: number;
}

export class FollowUserDto {
    userId: number;
}

export class GetUserFollowersDto {
    userId: number;
}