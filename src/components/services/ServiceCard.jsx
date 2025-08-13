import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/button";
import { Clock, CreditCard } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ServiceCard = ({ service }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Card
      className="overflow-hidden transition-all duration-300 hover:shadow-md h-full flex flex-col"
      key={service.id}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-1">
            {service.name_en || service.name_ar}
          </CardTitle>{" "}
          {/* Changed from service.name */}
        </div>
      </CardHeader>

      <CardContent className="px-4 py-2 flex-grow">
        <div className="relative aspect-video w-full mb-3 bg-gray-100 rounded-md overflow-hidden">
          <img
            src={`${service.image}`}
            alt={service.name_ar || service.name_en}
            className="object-cover w-full h-full"
          />
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {service?.category?.name_en}
        </p>
        {service.old_price > 0 && service.old_price > service.price && (
          <span className=" top-2 left-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            -
            {Math.round(
              ((service.old_price - service.price) / service.old_price) * 100
            )}
            %
          </span>
        )}

        <div className="flex items-center gap-2">
          {service.old_price && service.old_price > service.price && (
            <span className="line-through text-gray-400 text-sm">
              {service.old_price}$
            </span>
          )}
          <span className="text-lg font-bold text-orange-600">
            {service.price}$
          </span>
        </div>

        <div className="mt-auto">
          <div className="flex justify-between items-baseline">
            {/* Price display logic can go here if desired */}
          </div>
          {user ? (
            service.subscription ? (
              <Button
                size="sm"
                onClick={() => navigate(`/streams/${service.id}`)}
              >
                <Clock className="h-4 w-4 mr-2" />
                Subscribe Now
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => navigate(`/services/${service.id}`)}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Order Now
              </Button>
            )
          ) : (
            <Button size="sm" onClick={() => navigate(`/login`)}>
              <CreditCard className="h-4 w-4 mr-2" />
              Order Now
            </Button>
          )}
        </div>
      </CardContent>

      <CardFooter className="px-4 py-3 pt-0 flex gap-2"></CardFooter>
    </Card>
  );
};

export default ServiceCard;
