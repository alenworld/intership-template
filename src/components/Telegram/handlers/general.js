const start = async (ctx) => {
  try {
    await ctx.reply(`Hi, ${ctx.from.first_name}`);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  startHandler: start,
};
