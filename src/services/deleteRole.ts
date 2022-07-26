import prisma from '../lib/prisma.js';

/**
 * Delete guild role
 * @param roleId string
 * @return Role
 */
async function deleteRole(roleId: string) {
	return await prisma.role.delete({
		where: { id: roleId },
	});
}

export default deleteRole;
