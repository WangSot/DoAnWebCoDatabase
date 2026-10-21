import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 4 món lấy từ menu.html / datmon.html
  const menu = [
    { slug: "photai",  name: "Phở tái",         price: 40000, imageUrl: "imgs/photai.webp" },
    { slug: "phoga",   name: "Phở gà",          price: 40000, imageUrl: "imgs/phoga.jpg" },
    { slug: "phochin", name: "Phở chín",        price: 40000, imageUrl: "imgs/phochin.webp" },
    { slug: "phosuon", name: "Phở sườn Korea",  price: 40000, imageUrl: "imgs/phosuon.jpg" },
  ];

  for (const item of menu) {
    await prisma.menuItem.upsert({
      where: { slug: item.slug },
      update: item,
      create: item,
    });
  }

  // 1 đơn hàng mẫu để thử
  const photai = await prisma.menuItem.findUniqueOrThrow({ where: { slug: "photai" } });
  await prisma.order.create({
    data: {
      customerName: "Nguyễn Văn A",
      phone: "0900000000",
      address: "Số 1, đường Láng, Hà Nội",
      totalPrice: photai.price * 2,
      items: {
        create: [{ menuItemId: photai.id, quantity: 2, unitPrice: photai.price }],
      },
    },
  });

  console.log("Seed xong!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
