const prisma = require('./prisma')

const getAllUser = () => {
    return prisma.user.findMany({
        select: {
            id: true,
            nome: true,
            email: true,
            password: true,
            BookMany: {
                select: {
                    recipe: {
                        select: {
                            nome: true,
                            descricao: true,
                        }
                    }
                }
            }
        }
    });
}

const getIdUser = (id) => {
    const userId = prisma.user.findUnique({
        select: {
            id: true,
            nome: true,
            email: true,
            password: false,
            BookMany: {
                select: {
                    recipe: {
                        select: {
                            id: true,
                            nome: true,
                            descricao: true,
                            tempo: true,
                        }
                    }
                }
            }
        },
        where: {
            id,
        },
    })
    return userId;
}

const findUserByEmail = (email) => {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  };

const createUser = (data) => {
    const create = prisma.user.create({
        data: data
    });
    return create;
}

const updateUser = (id, data) => {
    const updateId = prisma.user.update({
        where: {
            id: id,
        },
        data: data
    })
    return updateId;
}

const deleteUser = async (id) => {
    await prisma.user.delete({
        where: {
            id: id,
        },
    })

    await prisma.user.deleteMany({
        where: {
            id: id
        }
    })
}



module.exports = {
    getAllUser,
    getIdUser,
    findUserByEmail,
    createUser,
    updateUser,
    deleteUser,
}