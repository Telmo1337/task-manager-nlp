export declare class TaskRepository {
    create(data: {
        title: string;
        dueAt: Date;
    }): import(".prisma/client").Prisma.Prisma__TaskClient<{
        title: string;
        dueAt: Date;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        title: string;
        dueAt: Date;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }[]>;
    findDueToday(): import(".prisma/client").Prisma.PrismaPromise<{
        title: string;
        dueAt: Date;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }[]>;
    findDueTomorrow(): import(".prisma/client").Prisma.PrismaPromise<{
        title: string;
        dueAt: Date;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }[]>;
    findDueOnDate(date: string): import(".prisma/client").Prisma.PrismaPromise<{
        title: string;
        dueAt: Date;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }[]>;
    findDuplicate(title: string, dueAt: Date): import(".prisma/client").Prisma.Prisma__TaskClient<{
        title: string;
        dueAt: Date;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    deleteById(id: number): import(".prisma/client").Prisma.Prisma__TaskClient<{
        title: string;
        dueAt: Date;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    updateById(id: number, data: {
        title?: string;
        dueAt?: Date;
    }): import(".prisma/client").Prisma.Prisma__TaskClient<{
        title: string;
        dueAt: Date;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findByTitle(title: string): import(".prisma/client").Prisma.PrismaPromise<{
        title: string;
        dueAt: Date;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }[]>;
}
