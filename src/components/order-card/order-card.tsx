import type { OrderDto } from "@/models/order";
import { motion } from "framer-motion";
import CardHr from "./card-hr";

interface OrderCardProps {
    order: OrderDto;
}

function OrderCard(
    props: OrderCardProps
) {
    return (
        <>
            <motion.article
                    key={props.order.id}
                    variants={{
                      hidden: { opacity: 0, y: 16 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
                    }}
                    className="group overflow-hidden rounded-2xl border border-[#ccdfe9] bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#2a7db5]/40 hover:shadow-lg dark:border-[#1a2d3e] dark:bg-[#0d1e2d] dark:hover:border-[#2a7db5]/30 dark:hover:shadow-black/40"
                  >
                    <CardHr barColor=""/>

                    <div className="flex items-center gap-3 px-5 py-4">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 ${meal.color}`}>
                        {meal.icon}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide ${meal.color}`}>
                            {meal.label}
                          </span>
                        </div>
                        <h3 className="mt-0.5 truncate text-sm font-bold leading-tight text-[#0d2233] dark:text-[#ddeef7] sm:text-base">
                          {order.meal.name}
                        </h3>
                        <p className="truncate text-xs font-light text-[#5c85a0] dark:text-[#7a9baf]">
                          Menu:{' '}
                          <span className="font-medium text-[#0d2233] dark:text-[#ddeef7]">
                            {order.menu.name}
                          </span>
                        </p>
                      </div>

                      <div className="flex shrink-0 flex-col items-end gap-1.5">
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusConfig.classes}`}>
                          {statusConfig.icon}
                          {statusConfig.label}
                        </span>
                        
                        {/* Date formatée avec la nouvelle fonction */}
                        <span className="rounded bg-[#f2f8fc] px-2 py-0.5 font-mono text-[0.62rem] text-[#7a9baf] dark:bg-[#0e1e2d] dark:text-[#5c85a0]">
                          {formatDate(order.created_at)}
                        </span>
                      </div>
                    </div>
                  </motion.article>
        </>
    );
}

export default OrderCard;