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
        type: "bar",
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
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: false,
          columnWidth: '70%',
          distributed: true
        }
      },
      tooltip: {
        theme: "dark",
        y: {
          formatter: function(val) {
            return "₹" + val.toFixed(2)
          }
        }
      },
      colors: ['#00E396', '#008FFB', '#FEB019', '#FF4560', '#775DD0'],
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return "₹" + val.toFixed(2);
        },
        style: {
          fontSize: '12px',
          colors: ["#000"]
        },
        offsetY: -20
      },
      title: {
        text: "Daily Sales Trend",
        align: "left",
        style: {
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#333'
        }
      },
      grid: {
        borderColor: "#e0e0e0",
        strokeDashArray: 4,
        yaxis: {
          lines: {
            show: true
          }
        }
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#333'
          }
        },
        labels: {
          style: {
            fontSize: '12px',
          },
          rotate: -45,
          rotateAlways: true
        },
        axisBorder: {
          show: true,
          color: '#e0e0e0'
        },
        crosshairs: {
          show: true
        }
      },
      yaxis: {
        title: {
          text: "Sales (₹)",
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#333'
          }
        },
        min: 0,
        labels: {
          style: {
            fontSize: '12px',
          },
          formatter: function (val) {
            return "₹" + val.toFixed(2);
          }
        }
      },
      fill: {
        opacity: 1
      },
      legend: {
        show: false
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            plotOptions: {
              bar: {
                columnWidth: '85%'
              }
            },
            chart: {
              height: 300
            },
            xaxis: {
              labels: {
                rotate: -45,
                maxHeight: 60
              }
            }
          }
        }
      ]
    },
    series: [{ name: "Daily Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      // Sort the sales data by date
      const sortedSales = [...salesDetail].sort((a, b) => new Date(a._id) - new Date(b._id));
      
      // Format dates to be more readable
      const formattedSalesData = sortedSales.map((item) => ({
        x: new Date(item._id).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        }),
        y: parseFloat(item.totalSales.toFixed(2))
      }));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: formattedSalesData.map((item) => item.x),
          },
        },
        series: [
          { 
            name: "Daily Sales", 
            data: formattedSalesData.map((item) => item.y)
          },
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






