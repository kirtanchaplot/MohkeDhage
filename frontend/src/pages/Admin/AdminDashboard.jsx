import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";

import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [state, setState] = useState({
    options: {
      chart: {
        type: "line",
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
          },
        },
      },
      tooltip: {
        theme: "light",
      },
      colors: ["#00E396"],
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return "₹" + val;
        },
        style: {
          fontSize: '12px',
        }
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Sales Trend",
        align: "left",
        style: {
          fontSize: '16px',
        }
      },
      grid: {
        borderColor: "#ccc",
        strokeDashArray: 4,
      },
      markers: {
        size: 1,
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
          style: {
            fontSize: '12px',
          }
        },
        labels: {
          style: {
            fontSize: '10px',
          },
          rotateAlways: true,
        }
      },
      yaxis: {
        title: {
          text: "Sales",
          style: {
            fontSize: '12px',
          }
        },
        min: 0,
        labels: {
          style: {
            fontSize: '10px',
          },
          formatter: function (val) {
            return "₹" + val;
          }
        }
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
        fontSize: '12px',
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            chart: {
              height: 300,
            },
            xaxis: {
              labels: {
                rotate: -45,
                maxHeight: 60,
              }
            }
          }
        }
      ]
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: formattedSalesDate.map((item) => item.x),
          },
        },
        series: [
          { name: "Sales", data: formattedSalesDate.map((item) => item.y) },
        ],
      }));
    }
  }, [salesDetail]);

  return (
    <div className="flex flex-col md:flex-row">
      <AdminMenu />

      <section className="w-full px-4 md:px-8 py-4 md:ml-0 lg:ml-4">
        <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4">
          <div className="rounded-lg bg-black p-4 w-full sm:w-[calc(50%-8px)] md:w-[calc(33.33%-16px)] lg:w-[20rem] mt-3">
            <div className="font-bold rounded-full h-10 w-10 bg-pink-500 text-center flex items-center justify-center text-white">
              ₹
            </div>
            <p className="mt-4 text-white">Sales</p>
            <h1 className="text-xl font-bold text-white">
              {isLoading ? (
                <Loader />
              ) : sales?.totalSales ? (
                `₹ ${sales.totalSales.toFixed(2)}`
              ) : (
                "₹ 0.00"
              )}
            </h1>
          </div>
          
          <div className="rounded-lg bg-black p-4 w-full sm:w-[calc(50%-8px)] md:w-[calc(33.33%-16px)] lg:w-[20rem] mt-3">
            <div className="font-bold rounded-full h-10 w-10 bg-pink-500 text-center flex items-center justify-center text-white">
              All
            </div>
            <p className="mt-4 text-white">Customers</p>
            <h1 className="text-xl font-bold text-white">
              {loading ? <Loader /> : customers?.length}
            </h1>
          </div>
          
          <div className="rounded-lg bg-black p-4 w-full sm:w-[calc(50%-8px)] md:w-[calc(33.33%-16px)] lg:w-[20rem] mt-3">
            <div className="font-bold rounded-full h-10 w-10 bg-pink-500 text-center flex items-center justify-center text-white">
              All
            </div>
            <p className="mt-4 text-white">Orders</p>
            <h1 className="text-xl font-bold text-white">
              {loadingTwo ? <Loader /> : orders?.totalOrders}
            </h1>
          </div>
        </div>

        <div className="w-full mt-8 md:mt-10">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <Chart
              options={state.options}
              series={state.series}
              type="bar"
              width="100%"
              height={350}
            />
          </div>
        </div>

        <div className="mt-8 md:mt-10">
          <OrderList />
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;






