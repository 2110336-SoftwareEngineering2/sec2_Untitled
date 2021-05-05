import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('admin')
export class AdminController {
    @Get('/login')
    renderLogin(@Res() res){
        res.render('./admin/login')
    }

    @Get('/register')
    renderRegister(@Res() res){
        res.render('./admin/register')
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Get('')
    renderAdmin(@Res() res){
        res.render('./admin/index')
    }
}


