import { motion } from 'framer-motion';

const STATS = [
  { label: "Active Students", value: "25k+" },
  { label: "Issues Resolved", value: "1.2k+" },
  { label: "Response Time", value: "< 24h" },
  { label: "Member Orgs", value: "150+" }
];

const Stats = () => {
  return (
    <section className="py-20 bg-white border-y border-slate-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:divide-x lg:divide-slate-100">
          {STATS.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center lg:px-8"
            >
              <div className="text-4xl lg:text-5xl font-black text-indigo-600 mb-3 tracking-tighter">
                {stat.value}
              </div>
              <div className="text-slate-400 font-bold uppercase tracking-[2px] text-xs">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
