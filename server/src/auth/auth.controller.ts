import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    console.log(`[AUTH CONTROLLER] 1. Tentative de connexion reçue pour: ${body.email}`);
    
    try {
      console.log(`[AUTH CONTROLLER] 2. Appel de authService.validateUser...`);
      const user = await this.authService.validateUser(body.email, body.password);
      
      // La ligne ci-dessous peut afficher des informations sensibles dans les logs, à utiliser uniquement pour le débogage.
      console.log(`[AUTH CONTROLLER] 3. 'validateUser' a retourné l'utilisateur.`); 
      
      const result = await this.authService.login(user);
      console.log(`[AUTH CONTROLLER] 4. 'login' (création du JWT) a réussi.`);
      
      return result;

    } catch (error) {
      // SI QUELQUE CHOSE PLANTE, ON ATTRAPE L'ERREUR ICI !
      console.error(`[AUTH CONTROLLER] !!! ERREUR ATTRAPÉE DANS LE CONTRÔLEUR !!!`);
      console.error(`[AUTH CONTROLLER] Type de l'erreur: ${error.name}`);
      console.error(`[AUTH CONTROLLER] Message de l'erreur: ${error.message}`);
      console.error(`[AUTH CONTROLLER] Stack Trace:`, error.stack);
      
      // On renvoie l'erreur originale au frontend pour qu'il affiche le bon message
      throw error;
    }
  }

  @Post('register')
  async register(@Body() body: { email: string; password: string; fullName: string; role: string }) {
    // Validate input
    if (!body.email || !body.password || !body.fullName || !body.role) {
      throw new Error('All fields (email, password, fullName, role) are required.');
    }
    return this.authService.register(body);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req) {
    // Pour une déconnexion réelle, vous devriez implémenter une liste noire de tokens.
    // Pour l'instant, le client supprime simplement le token.
    return { message: 'Logged out' };
  }

  @Post('password-reset-request')
  async passwordResetRequest(@Body() body: { email: string }) {
    await this.authService.initiatePasswordReset(body.email);
    return { message: 'Password reset link sent if email exists.' };
  }

  @Post('password-reset-confirm')
  async passwordResetConfirm(@Body() body: { token: string; newPassword: string }) {
    await this.authService.confirmPasswordReset(body.token, body.newPassword);
    return { message: 'Password has been reset.' };
  }
}