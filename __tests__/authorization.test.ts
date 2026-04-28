import { Roles } from '../enums/Roles';
import { hasPermissionClaim, hasRole, isAdminUser } from '../lib/domain/authorization';

describe('authorization helpers', () => {
  it('matches roles case-insensitively', () => {
    expect(hasRole({ roles: ['admin', 'member'] }, Roles.Admin)).toBe(true);
    expect(hasRole({ roles: ['member'] }, Roles.Admin)).toBe(false);
  });

  it('matches permission claims case-insensitively', () => {
    expect(hasPermissionClaim({ permissionClaims: ['admin.access'] }, 'ADMIN.ACCESS')).toBe(true);
    expect(hasPermissionClaim({ permissionClaims: ['trainer.manage'] }, 'admin.access')).toBe(
      false,
    );
  });

  it('treats admin role or claim as admin access', () => {
    expect(isAdminUser({ roles: [Roles.Admin] })).toBe(true);
    expect(isAdminUser({ permissionClaims: ['admin.access'] })).toBe(true);
    expect(isAdminUser({ roles: ['member'], permissionClaims: ['gym.view'] })).toBe(false);
  });
});
