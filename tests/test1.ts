import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {

  console.log('Creating author...');
  const authorInput: Prisma.AuthorCreateInput = {
    id: 0,
    name: 'Author LeGuy',
    biography: 'Author LeGuy is French. (inferenceConfidence = 0.72)'
  }
  const author = await prisma.author.create({ data: authorInput });
  console.log(author);

  console.log('Creating books...');
  const sqlBookPromise = prisma.$executeRaw`INSERT INTO "Book" (id, title, "authorId", isbn) VALUES (0, 'How to Write SQL', ${author.id}, 12345678901);`;
  const prismaBookInputPromise = prisma.book.create({data: {
    id: 1,
    title: 'How to write Prisma',
    authorId: author.id,
    isbn: 12345678901
  }});
  // TODO: Investigate type safety stuff.
  // const prismaBookInput: Prisma.BookCreateInput = {
  //   id: 1,
  //   title: 'How to write Prisma',
  //   authorId: author.id, // Why? What?
  //   isbn:12345678901
  // }
  
  const [sqlBook, prismaBook] = await Promise.all([sqlBookPromise, prismaBookInputPromise]);
  const allBooks = await prisma.book.findMany();
  console.log(allBooks);

  console.log('Deleting books and author...');
  await prisma.book.deleteMany();
  await prisma.author.deleteMany();
  
  const noBooks = await prisma.book.findMany();
  console.log(noBooks);
  console.log('Done!');
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
  })