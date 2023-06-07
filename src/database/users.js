const prisma = require('./prisma')

const getAllUser = () => {
    return prisma.user.findMany({
        select: {
            id: true,
            nome: true,
            email: true,
            password: false,
            BookMany: {
                select: {
                    recipe: {
                        select: {
                            nome: true,
                            descricao: true,
                            tempo: true
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
            id,
        },
        data: data
    })
    return updateId;
}

const deleteUser = async (id) => {
    const bookCount = await prisma.book.count({
        where: {
            userId: id
        }
    })

    if (bookCount > 0) {
        throw new Error("Não é possível excluir o usuário. Pois há registros.");
    }

    await prisma.user.delete({
        where: {
            id: id,
        }
    })

    await prisma.user.deleteMany({
        where: {
            id: id
        }
    })
}

const verirfyUser = (id) => {
    return prisma.user.findFirst({
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
    verirfyUser
}