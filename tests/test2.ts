import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function rentBook(bookId: number, memberId: number) {
  return prisma.book.update({ 
    where: {
      id: bookId
    },
    data: {
      rentedById: memberId
    }
  });
}

async function main() {

  console.log('Initializing records...')
  const myAuthorPromise = prisma.author.create({ data: {
    id: 0,
    name: 'Author LeGuy',
    biography: 'Author LeGuy is still French. (inference confidence: 0.67)'
  }});
  const myMemberPromise = prisma.member.create({ data: {
    id: 0,
    name: 'Thiefy McThief',
    email: 'thiefface@criminals.lol',
    address: 'Wouldn\'t you like to know?'
  }});

  const [myAuthor, myMember] = await Promise.all([myAuthorPromise, myMemberPromise]);

  const [myBook1, myBook2] = await Promise.all([
    prisma.book.create({ data: {
      id: 0,
      title: 'A Little Lesson in Trickery',
      authorId: myAuthor.id,
      isbn: 12345678901
    }}),
    prisma.book.create({ data: {
      id: 1,
      title: 'This',
      authorId: myAuthor.id,
      isbn: 98765432109
    }})
  ]);

  console.log('Borrowing books...');
  const [rentedBook1, rentedBook2] = await Promise.all([
    rentBook(myBook1.id, myMember.id),
    rentBook(myBook2.id, myMember.id)
  ]);
  console.log(`Book '${rentedBook1.title}' has been rented by '${myMember.name}', as has '${rentedBook2.title}'.`);
  
  const myMember2 = await prisma.member.findUnique({
    where: {
      id: myMember.id
    },
    include: {
      booksRented: true
    }
  });
  console.log(`Member '${myMember.name}' has rented the following books: ${myMember2?.booksRented.map(book => book.title).join('; ')}`);

  // TODO: Can I somehow do this out of order?
  console.log('Cleaning up...');
  await prisma.book.deleteMany();
  await Promise.all([
    prisma.author.deleteMany(),
    prisma.member.deleteMany()
  ]);
  console.log('Done!');
}

main()
  .then(async () => {
      await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  })